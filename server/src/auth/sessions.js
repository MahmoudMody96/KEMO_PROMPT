// server/src/auth/sessions.js — Password hashing, session issuing, revocation.
//
// The session token is a JWT carrying a session id. The id also lives in the
// database, so signing out actually ends the session — a plain stateless JWT
// stays valid until it expires no matter what the user clicks.
// Only the SHA-256 of the id is stored: a database dump hands out no sessions.

import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import { query, queryOne } from '../db.js';

const BCRYPT_ROUNDS = 12;
export const SESSION_COOKIE = 'kemo_session';

// --- passwords ---------------------------------------------------------

export function hashPassword(plain) {
    return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export function verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
}

/**
 * A dummy compare burns roughly the same time as a real one. Without it,
 * "unknown email" returns noticeably faster than "wrong password" and the
 * login endpoint becomes a user-enumeration oracle.
 */
const DUMMY_HASH = bcrypt.hashSync('kemo-timing-equaliser', BCRYPT_ROUNDS);
export function burnPasswordTime() {
    return bcrypt.compare('kemo-timing-equaliser', DUMMY_HASH);
}

// --- sessions ----------------------------------------------------------

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

export async function createSession(userId) {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + config.jwt.sessionDays * 86_400_000);

    await query(
        `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
        [userId, sha256(sessionId), expiresAt]
    );

    const token = jwt.sign(
        { sub: userId, sid: sessionId },
        config.jwt.secret,
        { expiresIn: `${config.jwt.sessionDays}d` }
    );

    return { token, expiresAt };
}

/** @returns {Promise<{userId: string}|null>} */
export async function resolveSession(token) {
    let payload;
    try {
        payload = jwt.verify(token, config.jwt.secret);
    } catch {
        return null;   // expired, tampered, or signed with a different secret
    }
    if (!payload?.sub || !payload?.sid) return null;

    const row = await queryOne(
        `SELECT user_id FROM refresh_tokens
         WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW()`,
        [sha256(payload.sid)]
    );
    if (!row || row.user_id !== payload.sub) return null;

    return { userId: row.user_id };
}

export async function revokeSession(token) {
    try {
        const payload = jwt.verify(token, config.jwt.secret);
        if (payload?.sid) {
            await query(
                `UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1`,
                [sha256(payload.sid)]
            );
        }
    } catch {
        // Already invalid — clearing the cookie is enough.
    }
}

export function revokeAllSessions(userId) {
    return query(
        `UPDATE refresh_tokens SET revoked_at = NOW()
         WHERE user_id = $1 AND revoked_at IS NULL`,
        [userId]
    );
}

/** Expired rows serve no purpose; called on a timer from index.js. */
export function purgeExpiredSessions() {
    return query(`DELETE FROM refresh_tokens WHERE expires_at < NOW() - INTERVAL '7 days'`);
}

// --- cookie ------------------------------------------------------------

export function sessionCookieOptions(expiresAt) {
    return {
        httpOnly: true,                  // JavaScript can't read it, so XSS can't steal it
        secure: config.isProduction,     // HTTPS only in production
        sameSite: 'lax',                 // 'strict' would drop the cookie on the
                                         // return trip from LemonSqueezy checkout
        path: '/',
        expires: expiresAt,
    };
}
