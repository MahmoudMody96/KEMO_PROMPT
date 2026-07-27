// server/src/routes/admin.js — Admin dashboard data.
//
// Guarded by requireAdmin, which answers 404 rather than 403 so the route
// doesn't advertise itself. Admin status lives in users.is_admin and is only
// settable from a database console.

import express from 'express';
import { query, queryOne } from '../db.js';
import { requireAuth, requireAdmin } from '../auth/middleware.js';

const router = express.Router();

const SORTABLE = new Set(['created_at', 'email', 'display_name', 'plan', 'credits_remaining', 'credits_used']);
const PLANS = new Set(['free', 'basic', 'pro', 'enterprise']);

router.use(requireAuth, requireAdmin);

// --- GET /api/admin/overview -------------------------------------------
router.get('/overview', async (req, res) => {
    try {
        const [users, logs, active] = await Promise.all([
            queryOne(`
                SELECT COUNT(*)::int AS total,
                       COALESCE(SUM(credits_used), 0)::int AS credits_used,
                       COALESCE(SUM(credits_remaining), 0)::int AS credits_remaining,
                       COUNT(*) FILTER (WHERE plan = 'free')::int AS free,
                       COUNT(*) FILTER (WHERE plan = 'basic')::int AS basic,
                       COUNT(*) FILTER (WHERE plan = 'pro')::int AS pro,
                       COUNT(*) FILTER (WHERE plan = 'enterprise')::int AS enterprise
                FROM users
            `),
            queryOne(`
                SELECT COUNT(*)::int AS total,
                       COUNT(*) FILTER (WHERE success)::int AS successful,
                       COUNT(*) FILTER (WHERE NOT success)::int AS failed
                FROM usage_logs
            `),
            queryOne(`
                SELECT COUNT(DISTINCT user_id)::int AS active_today
                FROM usage_logs WHERE created_at >= CURRENT_DATE
            `),
        ]);

        return res.json({ users, requests: logs, active_today: active.active_today });
    } catch (err) {
        console.error('[ADMIN] overview failed:', err.message);
        return res.status(500).json({ error: 'Could not load the overview' });
    }
});

// --- GET /api/admin/users ----------------------------------------------
router.get('/users', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
        const search = String(req.query.search || '').trim();

        // Whitelisted, never interpolated from raw input.
        const sort = SORTABLE.has(req.query.sort) ? req.query.sort : 'created_at';
        const dir = req.query.dir === 'asc' ? 'ASC' : 'DESC';

        const params = [limit];
        let where = '';
        if (search) {
            params.push(`%${search}%`);
            where = `WHERE email ILIKE $2 OR display_name ILIKE $2`;
        }

        const { rows } = await query(
            `SELECT id, email, display_name, plan, credits_remaining, credits_used,
                    is_admin, last_login_at, created_at
             FROM users ${where}
             ORDER BY ${sort} ${dir}
             LIMIT $1`,
            params
        );
        return res.json({ users: rows });
    } catch (err) {
        console.error('[ADMIN] users failed:', err.message);
        return res.status(500).json({ error: 'Could not load users' });
    }
});

// --- GET /api/admin/logs -----------------------------------------------
router.get('/logs', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit, 10) || 200, 500);
        const action = String(req.query.action || '');

        const params = [limit];
        let where = '';
        if (action && action !== 'all') {
            params.push(action);
            where = 'WHERE action_type = $2';
        }

        const { rows } = await query(
            `SELECT l.id, l.action_type, l.credits_consumed, l.model_used, l.tokens_used,
                    l.success, l.error_message, l.duration_ms, l.created_at,
                    u.email, u.display_name
             FROM usage_logs l
             JOIN users u ON u.id = l.user_id
             ${where}
             ORDER BY l.created_at DESC
             LIMIT $1`,
            params
        );
        return res.json({ logs: rows });
    } catch (err) {
        console.error('[ADMIN] logs failed:', err.message);
        return res.status(500).json({ error: 'Could not load logs' });
    }
});

// --- PATCH /api/admin/users/:id ----------------------------------------
router.patch('/users/:id', async (req, res) => {
    try {
        const { credits_remaining, plan } = req.body || {};
        const sets = [];
        const values = [];

        if (credits_remaining !== undefined) {
            const amount = Number(credits_remaining);
            if (!Number.isInteger(amount) || amount < 0 || amount > 1_000_000) {
                return res.status(400).json({ error: 'Credits must be between 0 and 1,000,000' });
            }
            values.push(amount);
            sets.push(`credits_remaining = $${values.length}`);
        }

        if (plan !== undefined) {
            if (!PLANS.has(plan)) return res.status(400).json({ error: 'Unknown plan' });
            values.push(plan);
            sets.push(`plan = $${values.length}`);
        }

        if (!sets.length) return res.status(400).json({ error: 'Nothing to update' });

        values.push(req.params.id);
        const row = await queryOne(
            `UPDATE users SET ${sets.join(', ')} WHERE id = $${values.length}
             RETURNING id, email, plan, credits_remaining, credits_used`,
            values
        );
        if (!row) return res.status(404).json({ error: 'User not found' });

        // Manual balance changes belong in the audit trail like any other.
        if (credits_remaining !== undefined) {
            await query(
                `INSERT INTO credit_transactions
                    (user_id, amount, balance_after, transaction_type, description)
                 VALUES ($1, 0, $2, 'admin_adjustment', $3)`,
                [row.id, row.credits_remaining, `Set by admin ${req.user.email}`]
            );
        }

        console.log(`[ADMIN] ${req.user.email} updated ${row.email}`);
        return res.json({ user: row });
    } catch (err) {
        console.error('[ADMIN] update failed:', err.message);
        return res.status(500).json({ error: 'Could not update the user' });
    }
});

export default router;
