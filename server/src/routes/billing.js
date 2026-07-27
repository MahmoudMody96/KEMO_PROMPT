// server/src/routes/billing.js — LemonSqueezy checkout + webhook.

import crypto from 'node:crypto';
import express from 'express';
import config from '../config.js';
import { query, queryOne } from '../db.js';
import { requireAuth } from '../auth/middleware.js';
import { makeLimiter } from '../lib/rateLimit.js';

const router = express.Router();

const VARIANT_PLANS = {
    basic: { plan: 'basic', credits: 200, label: 'Basic' },
    pro: { plan: 'pro', credits: 500, label: 'Pro' },
    premium: { plan: 'enterprise', credits: 9999, label: 'Premium' },
};

/** variantId -> plan info, built per request so env changes don't need a restart. */
function variantMap() {
    const map = {};
    for (const [key, info] of Object.entries(VARIANT_PLANS)) {
        const id = config.lemon.variants[key];
        if (id) map[String(id)] = info;
    }
    return map;
}

// --- POST /api/create-checkout -----------------------------------------
// The buyer is taken from the session. A user id in the request body would let
// anyone credit someone else's account.
router.post(
    '/create-checkout',
    requireAuth,
    makeLimiter({ max: 10, windowMs: 60_000, key: 'checkout' }),
    async (req, res) => {
        try {
            const { variantId } = req.body || {};
            if (!variantId) return res.status(400).json({ error: 'variantId is required' });

            if (!config.lemon.apiKey) return res.status(500).json({ error: 'Payments are not configured' });
            if (!config.lemon.storeId) return res.status(500).json({ error: 'Store ID is not configured' });

            if (!variantMap()[String(variantId)]) {
                return res.status(400).json({ error: 'Unknown plan' });
            }

            const redirect = (config.appUrl || req.headers.origin || '').replace(/\/$/, '');

            const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
                method: 'POST',
                headers: {
                    Accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${config.lemon.apiKey}`,
                },
                body: JSON.stringify({
                    data: {
                        type: 'checkouts',
                        attributes: {
                            checkout_data: {
                                email: req.user.email,
                                custom: { user_id: req.user.id },
                            },
                            product_options: redirect ? { redirect_url: `${redirect}/` } : {},
                        },
                        relationships: {
                            store: { data: { type: 'stores', id: String(config.lemon.storeId) } },
                            variant: { data: { type: 'variants', id: String(variantId) } },
                        },
                    },
                }),
            });

            if (!response.ok) {
                console.error('[CHECKOUT] LemonSqueezy error:', response.status, await response.text());
                return res.status(502).json({ error: 'Failed to create checkout' });
            }

            const data = await response.json();
            const url = data.data?.attributes?.url;
            if (!url) return res.status(502).json({ error: 'No checkout URL returned' });

            return res.json({ url });

        } catch (err) {
            console.error('[CHECKOUT] error:', err.message);
            return res.status(500).json({ error: 'Internal error' });
        }
    }
);

// --- POST /api/lemonsqueezy-webhook ------------------------------------
// Mounted with express.raw() in index.js: the HMAC covers the exact bytes
// LemonSqueezy sent, and re-serialising a parsed object produces different ones.
router.post('/lemonsqueezy-webhook', async (req, res) => {
    try {
        const secret = config.lemon.webhookSecret;
        if (!secret) {
            console.error('[WEBHOOK] LEMONSQUEEZY_WEBHOOK_SECRET not configured');
            return res.status(500).json({ error: 'Webhook secret not configured' });
        }

        const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(String(req.body || ''));
        const signature = req.headers['x-signature'];
        if (!signature) return res.status(401).json({ error: 'Missing signature' });

        const digest = crypto.createHmac('sha256', secret).update(rawBody).digest();
        let received;
        try {
            received = Buffer.from(String(signature), 'hex');
        } catch {
            return res.status(401).json({ error: 'Invalid signature' });
        }
        // timingSafeEqual throws on a length mismatch, so check that first.
        if (received.length !== digest.length || !crypto.timingSafeEqual(digest, received)) {
            console.error('[WEBHOOK] invalid signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }

        let event;
        try {
            event = JSON.parse(rawBody.toString('utf8'));
        } catch {
            return res.status(400).json({ error: 'Malformed JSON' });
        }

        const eventName = event.meta?.event_name;
        const attributes = event.data?.attributes || {};
        console.log(`[WEBHOOK] ${eventName}`);

        // A retried delivery must not grant credits twice.
        const eventKey = `${eventName}:${event.data?.id}:${attributes.updated_at || ''}`;
        try {
            await query(
                `INSERT INTO webhook_events (id, provider) VALUES ($1, 'lemonsqueezy')`,
                [eventKey]
            );
        } catch (err) {
            if (err.code === '23505') {
                console.log(`[WEBHOOK] duplicate ${eventKey} — ignored`);
                return res.json({ message: 'Duplicate, ignored' });
            }
            console.error('[WEBHOOK] idempotency check failed:', err.message);
        }

        // Prefer the id we attached at checkout; fall back to the buyer's email,
        // which is trustworthy because the payload is HMAC-verified.
        let userId = event.meta?.custom_data?.user_id || null;
        if (!userId && attributes.user_email) {
            const row = await queryOne(
                'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
                [attributes.user_email]
            );
            userId = row?.id || null;
        }
        if (!userId) {
            console.warn('[WEBHOOK] no matching user');
            return res.json({ message: 'No matching user, skipped' });
        }

        const variantId = String(
            attributes.first_order_item?.variant_id || attributes.variant_id || ''
        );
        const info = variantMap()[variantId];

        switch (eventName) {
            case 'order_created':
            case 'subscription_payment_success': {
                if (!info) {
                    console.warn(`[WEBHOOK] unknown variant ${variantId}`);
                    return res.json({ message: 'Unknown variant' });
                }
                // ADD, never overwrite — overwriting deletes a balance the
                // customer already paid for.
                await query(
                    'SELECT add_credits($1, $2, $3, $4)',
                    [userId, info.credits, 'purchase', `${info.label} — order ${event.data?.id || ''}`]
                );
                await query(
                    `UPDATE users SET plan = $1, lemon_customer_id = $2, lemon_order_id = $3
                     WHERE id = $4`,
                    [info.plan, String(attributes.customer_id || ''), String(event.data?.id || ''), userId]
                );
                console.log(`[WEBHOOK] ${userId} → ${info.label} (+${info.credits})`);
                break;
            }

            case 'subscription_created':
            case 'subscription_updated': {
                if (attributes.status !== 'active' || !info) break;
                await query(
                    'UPDATE users SET plan = $1, lemon_subscription_id = $2 WHERE id = $3',
                    [info.plan, String(event.data?.id || ''), userId]
                );
                break;
            }

            case 'subscription_cancelled':
            case 'subscription_expired': {
                // Downgrade the plan, keep the balance — those credits were paid for.
                await query(
                    'UPDATE users SET plan = $1, lemon_subscription_id = NULL WHERE id = $2',
                    ['free', userId]
                );
                break;
            }

            default:
                console.log(`[WEBHOOK] unhandled: ${eventName}`);
        }

        return res.json({ message: 'OK' });

    } catch (err) {
        console.error('[WEBHOOK] error:', err.message);
        return res.status(500).json({ error: 'Internal error' });
    }
});

export default router;
