// server/src/auth/middleware.js — Who is calling, and may they.
//
// This is the authorization layer that replaced Supabase RLS. The database has
// no policies now, so every route that touches user data must go through here
// and then scope its own queries by req.user.id.

import { queryOne } from '../db.js';
import { SESSION_COOKIE, resolveSession } from './sessions.js';

const USER_COLUMNS = `
    id, email, display_name, avatar_url, plan,
    credits_remaining, credits_used, is_admin, created_at
`;

function readToken(req) {
    const fromCookie = req.cookies?.[SESSION_COOKIE];
    if (fromCookie) return fromCookie;

    // Bearer is accepted too, for scripts and for testing with curl.
    const header = req.headers.authorization || '';
    const match = /^Bearer\s+(.+)$/i.exec(header.trim());
    return match ? match[1] : null;
}

/** Populates req.user when a valid session exists. Never rejects. */
export async function attachUser(req, _res, next) {
    try {
        const token = readToken(req);
        if (!token) return next();

        const session = await resolveSession(token);
        if (!session) return next();

        req.user = await queryOne(
            `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
            [session.userId]
        );
    } catch (err) {
        console.error('[AUTH] attachUser failed:', err.message);
    }
    next();
}

/** Rejects anonymous callers. */
export function requireAuth(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'Sign in required' });
    }
    next();
}

/**
 * Rejects non-admins. Deliberately returns 404, not 403: a 403 confirms the
 * route exists and that admin accounts are worth hunting for.
 */
export function requireAdmin(req, res, next) {
    if (!req.user?.is_admin) {
        return res.status(404).json({ error: 'Not found' });
    }
    next();
}

export { USER_COLUMNS };
