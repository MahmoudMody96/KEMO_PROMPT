// server/src/lib/credits.js — Server-side credit accounting.
//
// Prices live here. The client sends an action name; it never sends a cost.

import { query, queryOne } from '../db.js';

export const CREDIT_COSTS = Object.freeze({
    brainstorm: 1,
    generate: 3,
    extract: 2,
    trend_search: 1,
    architect: 2,
});

const DEFAULT_ACTION = 'generate';

export function resolveAction(action) {
    return Object.prototype.hasOwnProperty.call(CREDIT_COSTS, action) ? action : DEFAULT_ACTION;
}

/**
 * Charge before the upstream call. Fails CLOSED — a database error blocks the
 * request rather than handing out a free generation.
 *
 * @returns {Promise<{ok: true, cost: number, action: string} | {ok: false, status: number, error: string}>}
 */
export async function chargeCredits(userId, action) {
    const resolved = resolveAction(action);
    const cost = CREDIT_COSTS[resolved];

    try {
        const row = await queryOne(
            'SELECT deduct_credits($1, $2, $3) AS ok',
            [userId, cost, `usage_${resolved}`]
        );

        if (row?.ok !== true) {
            return {
                ok: false,
                status: 402,
                error: 'Not enough credits. Upgrade your plan to continue.',
            };
        }
        return { ok: true, cost, action: resolved };
    } catch (err) {
        console.error('[CREDITS] deduct failed:', err.message);
        return { ok: false, status: 500, error: 'Could not verify your credit balance' };
    }
}

/** Give it back when the upstream call produced nothing. */
export async function refundCredits(userId, cost) {
    if (!userId || !cost) return;
    try {
        await query(
            'SELECT add_credits($1, $2, $3, $4)',
            [userId, cost, 'refund', 'Automatic refund — upstream request failed']
        );
    } catch (err) {
        console.error('[CREDITS] refund failed:', err.message);
    }
}

/** Best-effort analytics; never blocks the response. */
export async function logUsage(userId, action, details = {}) {
    if (!userId) return;
    const resolved = resolveAction(action);
    try {
        await query(
            `INSERT INTO usage_logs
                (user_id, action_type, credits_consumed, model_used, tokens_used,
                 input_summary, success, error_message, duration_ms)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
                userId,
                resolved,
                details.cost ?? CREDIT_COSTS[resolved],
                String(details.model || '').slice(0, 100),
                details.tokens || 0,
                String(details.summary || '').slice(0, 200),
                details.success !== false,
                details.error ? String(details.error).slice(0, 500) : null,
                details.duration || 0,
            ]
        );
    } catch (err) {
        console.error('[CREDITS] usage log failed:', err.message);
    }
}
