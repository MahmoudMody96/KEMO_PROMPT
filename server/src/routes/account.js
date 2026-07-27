// server/src/routes/account.js — Balance and usage for the signed-in user.

import express from 'express';
import { query } from '../db.js';
import { requireAuth } from '../auth/middleware.js';

const router = express.Router();

router.use(requireAuth);

// --- GET /api/account/credits ------------------------------------------
router.get('/credits', (req, res) => res.json({
    credits_remaining: req.user.credits_remaining,
    credits_used: req.user.credits_used,
    plan: req.user.plan,
}));

// --- GET /api/account/transactions -------------------------------------
router.get('/transactions', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
        const { rows } = await query(
            `SELECT amount, balance_after, transaction_type, description, created_at
             FROM credit_transactions WHERE user_id = $1
             ORDER BY created_at DESC LIMIT $2`,
            [req.user.id, limit]
        );
        return res.json({ transactions: rows });
    } catch (err) {
        console.error('[ACCOUNT] transactions failed:', err.message);
        return res.status(500).json({ error: 'Could not load your transactions' });
    }
});

// --- GET /api/account/usage --------------------------------------------
router.get('/usage', async (req, res) => {
    try {
        const { rows } = await query(
            `SELECT action_type, COUNT(*)::int AS runs, SUM(credits_consumed)::int AS credits
             FROM usage_logs WHERE user_id = $1
             GROUP BY action_type`,
            [req.user.id]
        );
        return res.json({ usage: rows });
    } catch (err) {
        console.error('[ACCOUNT] usage failed:', err.message);
        return res.status(500).json({ error: 'Could not load your usage' });
    }
});

// --- PATCH /api/account/profile ----------------------------------------
router.patch('/profile', async (req, res) => {
    try {
        const { display_name, avatar_url } = req.body || {};
        const sets = [];
        const values = [];

        // Only cosmetic fields. Plan and credits move through billing alone.
        if (typeof display_name === 'string') {
            values.push(display_name.trim().slice(0, 80));
            sets.push(`display_name = $${values.length}`);
        }
        if (typeof avatar_url === 'string') {
            values.push(avatar_url.trim().slice(0, 500));
            sets.push(`avatar_url = $${values.length}`);
        }
        if (!sets.length) return res.status(400).json({ error: 'Nothing to update' });

        values.push(req.user.id);
        await query(`UPDATE users SET ${sets.join(', ')} WHERE id = $${values.length}`, values);
        return res.json({ ok: true });
    } catch (err) {
        console.error('[ACCOUNT] profile update failed:', err.message);
        return res.status(500).json({ error: 'Could not update your profile' });
    }
});

export default router;
