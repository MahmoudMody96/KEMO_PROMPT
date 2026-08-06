// server/src/routes/admin.js — Admin dashboard data.
//
// Guarded by requireAdmin, which answers 404 rather than 403 so the route
// doesn't advertise itself. Admin status lives in users.is_admin and is only
// settable from a database console.

import express from 'express';

import config from '../config.js';
import { query, queryOne, transaction } from '../db.js';
import { requireAuth, requireAdmin } from '../auth/middleware.js';
import { getSettings, invalidateSettings } from '../lib/settings.js';

const router = express.Router();

const SORTABLE = new Set(['created_at', 'email', 'display_name', 'plan', 'credits_remaining', 'credits_used']);
const PLANS = new Set(['free', 'basic', 'pro', 'enterprise']);

// The System Status panel used to hardcode every row to "online". API and
// Database were at least implied by the request succeeding — but the LLM
// provider, the one dependency that actually breaks, was never checked. A
// revoked key showed up only as a 502 to end users and one line in the
// container log.
//
// Cached: this is an outbound HTTPS call on a dashboard that polls.
const PROVIDER_TTL_MS = 60_000;
let providerCache = null;

async function providerHealth() {
    if (providerCache && Date.now() - providerCache.at < PROVIDER_TTL_MS) {
        return providerCache.value;
    }

    let value;
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5_000);
        // Derive the /key endpoint from the configured chat URL so a gateway or
        // proxy set via OPENROUTER_URL is probed, not the public host.
        const keyUrl = new URL('/api/v1/key', config.openRouter.url).toString();
        // /key reports the credentials' own status without spending anything.
        const r = await fetch(keyUrl, {
            headers: { Authorization: `Bearer ${config.openRouter.apiKey}` },
            signal: controller.signal,
        }).finally(() => clearTimeout(timer));

        if (r.ok) value = { status: 'ok', detail: null };
        else if (r.status === 401 || r.status === 403) {
            value = { status: 'unauthorized', detail: 'The provider rejected the API key' };
        } else if (r.status === 402) {
            value = { status: 'no_credit', detail: 'The provider account is out of credit' };
        } else {
            value = { status: 'error', detail: `Provider returned ${r.status}` };
        }
    } catch (err) {
        // A probe failure is not proof the provider is down — the container may
        // simply have no egress. Say which one it is.
        console.error('[provider] probe failed:', err.name, err.message);
        value = { status: 'unreachable', detail: err.name === 'AbortError' ? 'Probe timed out' : 'Could not reach the provider' };
    }

    providerCache = { at: Date.now(), value };
    return value;
}

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

        return res.json({
            users,
            requests: logs,
            active_today: active.active_today,
            provider: await providerHealth(),
        });
    } catch (err) {
        console.error('[ADMIN] overview failed:', err.message);
        return res.status(500).json({ error: 'Could not load the overview' });
    }
});

// --- GET /api/admin/users ----------------------------------------------
router.get('/users', async (req, res) => {
    try {
        const limit = Math.max(1, Math.min(parseInt(req.query.limit, 10) || 50, 200));
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
        const limit = Math.max(1, Math.min(parseInt(req.query.limit, 10) || 200, 500));
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
            // Validate the RAW value, not a coerced one. Number() happily turns
            // null, '', false and [] into 0 — and the admin UI sends null for an
            // empty input, so a blank field silently zeroed the user's balance.
            if (!Number.isInteger(credits_remaining) ||
                credits_remaining < 0 || credits_remaining > 1_000_000) {
                return res.status(400).json({ error: 'Credits must be a whole number between 0 and 1,000,000' });
            }
            values.push(credits_remaining);
            sets.push(`credits_remaining = $${values.length}`);
        }

        if (plan !== undefined) {
            if (!PLANS.has(plan)) return res.status(400).json({ error: 'Unknown plan' });
            values.push(plan);
            sets.push(`plan = $${values.length}`);
        }

        if (!sets.length) return res.status(400).json({ error: 'Nothing to update' });

        values.push(req.params.id);

        // The balance change and its ledger row commit together, and the ledger
        // records the signed DELTA. It used to record amount = 0 with only
        // balance_after set, which meant SUM(amount) over credit_transactions no
        // longer reconciled to users.credits_remaining — the audit trail could
        // not be replayed. The row lock also stops a concurrent generation from
        // being silently re-granted by this absolute write.
        const row = await transaction(async (client) => {
            const before = await client.query(
                'SELECT credits_remaining FROM users WHERE id = $1 FOR UPDATE',
                [req.params.id]
            );
            if (!before.rows.length) return null;

            const updated = await client.query(
                `UPDATE users SET ${sets.join(', ')} WHERE id = $${values.length}
                 RETURNING id, email, plan, credits_remaining, credits_used`,
                values
            );
            const user = updated.rows[0];

            if (credits_remaining !== undefined) {
                const delta = user.credits_remaining - before.rows[0].credits_remaining;
                if (delta !== 0) {
                    await client.query(
                        `INSERT INTO credit_transactions
                            (user_id, amount, balance_after, transaction_type, description)
                         VALUES ($1, $2, $3, 'admin_adjustment', $4)`,
                        [user.id, delta, user.credits_remaining, `Set by admin ${req.user.email}`]
                    );
                }
            }
            return user;
        });

        if (!row) return res.status(404).json({ error: 'User not found' });

        console.log(`[ADMIN] ${req.user.email} updated ${row.email}`);
        return res.json({ user: row });
    } catch (err) {
        console.error('[ADMIN] update failed:', err.message);
        return res.status(500).json({ error: 'Could not update the user' });
    }
});

// --- GET /api/admin/settings -------------------------------------------
router.get('/settings', async (req, res) => {
    try {
        return res.json({ settings: await getSettings() });
    } catch (err) {
        console.error('[ADMIN] settings read failed:', err.message);
        return res.status(500).json({ error: 'Could not load settings' });
    }
});

// --- PATCH /api/admin/settings -----------------------------------------
//
// Each field is validated on its RAW value for the same reason the user PATCH
// above does: Number() maps null, '', false and [] all to 0, and an empty admin
// input posts null — which would quietly set new signups to zero credits.
const SETTING_COLUMNS = {
    defaultCredits: {
        column: 'default_credits',
        check: (v) => Number.isInteger(v) && v >= 0 && v <= 100_000,
        message: 'Default credits must be a whole number between 0 and 100,000',
    },
    maxRequestsPerMin: {
        column: 'max_requests_per_min',
        check: (v) => Number.isInteger(v) && v >= 1 && v <= 10_000,
        message: 'Max requests per minute must be a whole number between 1 and 10,000',
    },
    maintenanceMode: {
        column: 'maintenance_mode',
        check: (v) => typeof v === 'boolean',
        message: 'Maintenance mode must be true or false',
    },
    signupEnabled: {
        column: 'signup_enabled',
        check: (v) => typeof v === 'boolean',
        message: 'Signup enabled must be true or false',
    },
};

router.patch('/settings', async (req, res) => {
    try {
        const body = req.body || {};
        const sets = [];
        const values = [];

        for (const [key, spec] of Object.entries(SETTING_COLUMNS)) {
            if (body[key] === undefined) continue;
            if (!spec.check(body[key])) return res.status(400).json({ error: spec.message });
            values.push(body[key]);
            sets.push(`${spec.column} = $${values.length}`);
        }

        if (!sets.length) return res.status(400).json({ error: 'Nothing to update' });

        values.push(req.user.id);
        const row = await queryOne(
            `UPDATE app_settings
                SET ${sets.join(', ')}, updated_at = NOW(), updated_by = $${values.length}
              WHERE id = TRUE
              RETURNING *`,
            values,
        );

        // Without this the admin sees the new value while every other process
        // keeps serving the cached one for up to the TTL.
        invalidateSettings();

        const changed = Object.keys(SETTING_COLUMNS).filter((k) => body[k] !== undefined);
        console.log(`[ADMIN] ${req.user.email} changed settings: ${changed.join(', ')}`);

        return res.json({ settings: await getSettings(), updatedAt: row?.updated_at });
    } catch (err) {
        console.error('[ADMIN] settings update failed:', err.message);
        return res.status(500).json({ error: 'Could not save settings' });
    }
});

export default router;
