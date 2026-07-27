// server/src/routes/auth.js — register / login / logout / me
//
// This replaces Supabase Auth. Error messages are deliberately vague about
// which half of the credentials was wrong.

import express from 'express';
import config from '../config.js';
import { query, queryOne, transaction } from '../db.js';
import {
    SESSION_COOKIE, burnPasswordTime, createSession, hashPassword,
    revokeSession, sessionCookieOptions, verifyPassword,
} from '../auth/sessions.js';
import { requireAuth, USER_COLUMNS } from '../auth/middleware.js';
import { makeLimiter } from '../lib/rateLimit.js';

const router = express.Router();

const MIN_PASSWORD = 8;
const MAX_PASSWORD = 200;   // bcrypt only reads the first 72 bytes; cap the rest
const MAX_EMAIL = 254;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Brute force is the whole threat model for a login form.
const loginLimiter = makeLimiter({ max: 10, windowMs: 15 * 60_000, key: 'login' });
const registerLimiter = makeLimiter({ max: 5, windowMs: 60 * 60_000, key: 'register' });

function validateCredentials(email, password) {
    if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > MAX_EMAIL) {
        return 'Please enter a valid email address';
    }
    if (typeof password !== 'string' || password.length < MIN_PASSWORD) {
        return `Password must be at least ${MIN_PASSWORD} characters`;
    }
    if (password.length > MAX_PASSWORD) {
        return 'Password is too long';
    }
    return null;
}

function publicUser(row) {
    if (!row) return null;
    return {
        id: row.id,
        email: row.email,
        display_name: row.display_name,
        avatar_url: row.avatar_url,
        plan: row.plan,
        credits_remaining: row.credits_remaining,
        credits_used: row.credits_used,
        is_admin: row.is_admin,
    };
}

async function startSession(res, userId) {
    const { token, expiresAt } = await createSession(userId);
    res.cookie(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
}

// --- POST /api/auth/register -------------------------------------------
router.post('/register', registerLimiter, async (req, res) => {
    try {
        const { email, password, displayName } = req.body || {};

        const invalid = validateCredentials(email, password);
        if (invalid) return res.status(400).json({ error: invalid });

        const normalizedEmail = email.trim();
        const name = String(displayName || '').trim().slice(0, 80)
            || normalizedEmail.split('@')[0];

        const user = await transaction(async (client) => {
            const existing = await client.query(
                'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
                [normalizedEmail]
            );
            if (existing.rowCount > 0) return null;

            const passwordHash = await hashPassword(password);
            const { rows } = await client.query(
                `INSERT INTO users (email, password_hash, display_name, credits_remaining)
                 VALUES ($1, $2, $3, $4)
                 RETURNING ${USER_COLUMNS}`,
                [normalizedEmail, passwordHash, name, config.signupBonusCredits]
            );

            const created = rows[0];
            await client.query(
                `INSERT INTO credit_transactions (user_id, amount, balance_after, transaction_type, description)
                 VALUES ($1, $2, $2, 'signup_bonus', 'Welcome credits')`,
                [created.id, config.signupBonusCredits]
            );
            return created;
        });

        if (!user) {
            return res.status(409).json({ error: 'An account with this email already exists' });
        }

        await startSession(res, user.id);
        return res.status(201).json({ user: publicUser(user) });

    } catch (err) {
        // Two simultaneous signups with the same address both pass the SELECT
        // and race to the INSERT; the unique index decides, and the loser gets
        // the same answer as if it had lost the SELECT.
        if (err.code === '23505') {
            return res.status(409).json({ error: 'An account with this email already exists' });
        }
        console.error('[AUTH] register failed:', err.message);
        return res.status(500).json({ error: 'Could not create your account' });
    }
});

// --- POST /api/auth/login ----------------------------------------------
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const row = await queryOne(
            `SELECT ${USER_COLUMNS}, password_hash FROM users WHERE LOWER(email) = LOWER($1)`,
            [email.trim()]
        );

        // Same work and same message whether the email exists or not.
        const ok = row
            ? await verifyPassword(password, row.password_hash)
            : await burnPasswordTime().then(() => false);

        if (!ok) {
            return res.status(401).json({ error: 'Incorrect email or password' });
        }

        await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [row.id]);
        await startSession(res, row.id);
        return res.json({ user: publicUser(row) });

    } catch (err) {
        console.error('[AUTH] login failed:', err.message);
        return res.status(500).json({ error: 'Could not sign you in' });
    }
});

// --- POST /api/auth/logout ---------------------------------------------
router.post('/logout', async (req, res) => {
    try {
        const token = req.cookies?.[SESSION_COOKIE];
        if (token) await revokeSession(token);
    } catch (err) {
        console.error('[AUTH] logout failed:', err.message);
    }
    res.clearCookie(SESSION_COOKIE, { path: '/' });
    return res.json({ ok: true });
});

// --- GET /api/auth/me --------------------------------------------------
router.get('/me', (req, res) => {
    // Anonymous is a normal answer here, not an error — the app calls this on
    // load to decide whether to show the login screen.
    return res.json({ user: publicUser(req.user) });
});

// --- POST /api/auth/password -------------------------------------------
router.post('/password', requireAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body || {};

        const invalid = validateCredentials(req.user.email, newPassword);
        if (invalid) return res.status(400).json({ error: invalid });

        const row = await queryOne('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
        if (!row || !await verifyPassword(String(currentPassword || ''), row.password_hash)) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        await query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [await hashPassword(newPassword), req.user.id]
        );

        // Other devices keep a session that was minted under the old password.
        await query(
            `UPDATE refresh_tokens SET revoked_at = NOW()
             WHERE user_id = $1 AND revoked_at IS NULL`,
            [req.user.id]
        );
        await startSession(res, req.user.id);

        return res.json({ ok: true });
    } catch (err) {
        console.error('[AUTH] password change failed:', err.message);
        return res.status(500).json({ error: 'Could not change your password' });
    }
});

export default router;
