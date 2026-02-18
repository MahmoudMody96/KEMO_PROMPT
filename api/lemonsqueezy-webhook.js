// ============================================================
// LEMONSQUEEZY WEBHOOK — Vercel Serverless Function
// Receives payment events from LemonSqueezy and updates
// user credits/plan in Supabase.
// ============================================================

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// --- Supabase Admin Client (service role, bypasses RLS) ---
function getSupabaseAdmin() {
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
}

// --- Verify LemonSqueezy Webhook Signature ---
function verifySignature(rawBody, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(rawBody).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

// --- Variant → Plan/Credits Mapping ---
const VARIANT_MAP = {
    [process.env.VITE_LEMON_VARIANT_BASIC || '1318412']: {
        plan: 'basic',
        credits: 200,
        label: 'Basic'
    },
    [process.env.VITE_LEMON_VARIANT_PRO || '1318421']: {
        plan: 'pro',
        credits: 500,
        label: 'Pro'
    },
    [process.env.VITE_LEMON_VARIANT_PREMIUM || '1318422']: {
        plan: 'enterprise',
        credits: 9999,
        label: 'Premium'
    },
};

export default async function handler(req, res) {
    // Only accept POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 1. Get raw body for signature verification
        const rawBody = typeof req.body === 'string'
            ? req.body
            : JSON.stringify(req.body);

        // 2. Verify signature
        const signature = req.headers['x-signature'];
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

        if (!secret) {
            console.error('[WEBHOOK] LEMONSQUEEZY_WEBHOOK_SECRET not configured');
            return res.status(500).json({ error: 'Webhook secret not configured' });
        }

        if (!signature) {
            console.error('[WEBHOOK] Missing x-signature header');
            return res.status(401).json({ error: 'Missing signature' });
        }

        try {
            const isValid = verifySignature(rawBody, signature, secret);
            if (!isValid) {
                console.error('[WEBHOOK] Invalid signature');
                return res.status(401).json({ error: 'Invalid signature' });
            }
        } catch (sigErr) {
            console.error('[WEBHOOK] Signature verification failed:', sigErr.message);
            return res.status(401).json({ error: 'Signature verification failed' });
        }

        // 3. Parse the event
        const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const eventName = event.meta?.event_name;
        const customData = event.meta?.custom_data;

        console.log(`[WEBHOOK] Event: ${eventName}`);

        // 4. Get user ID from custom data
        const userId = customData?.user_id;
        if (!userId) {
            console.log('[WEBHOOK] No user_id in custom_data — skipping');
            return res.status(200).json({ message: 'No user_id, skipped' });
        }

        // 5. Get variant info
        const variantId = String(
            event.data?.attributes?.first_order_item?.variant_id ||
            event.data?.attributes?.variant_id ||
            ''
        );
        const variantInfo = VARIANT_MAP[variantId];

        // 6. Connect to Supabase
        const supabase = getSupabaseAdmin();
        if (!supabase) {
            console.error('[WEBHOOK] Supabase not configured');
            return res.status(500).json({ error: 'Database not configured' });
        }

        // 7. Handle events
        switch (eventName) {
            case 'order_created': {
                if (!variantInfo) {
                    console.log(`[WEBHOOK] Unknown variant ${variantId}`);
                    return res.status(200).json({ message: 'Unknown variant' });
                }

                // Update plan + add credits
                const { error: updateErr } = await supabase
                    .from('profiles')
                    .update({
                        plan: variantInfo.plan,
                        credits_remaining: variantInfo.credits,
                        lemon_customer_id: String(event.data?.attributes?.customer_id || ''),
                        lemon_order_id: String(event.data?.id || ''),
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', userId);

                if (updateErr) {
                    console.error('[WEBHOOK] Supabase update error:', updateErr);
                    return res.status(500).json({ error: 'Database update failed' });
                }

                console.log(`[WEBHOOK] ✅ User ${userId} upgraded to ${variantInfo.label} (${variantInfo.credits} credits)`);
                break;
            }

            case 'subscription_created':
            case 'subscription_updated': {
                const status = event.data?.attributes?.status;

                if (status === 'active' && variantInfo) {
                    await supabase
                        .from('profiles')
                        .update({
                            plan: variantInfo.plan,
                            credits_remaining: variantInfo.credits,
                            lemon_subscription_id: String(event.data?.id || ''),
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', userId);

                    console.log(`[WEBHOOK] ✅ Subscription active: ${variantInfo.label}`);
                }
                break;
            }

            case 'subscription_cancelled':
            case 'subscription_expired': {
                await supabase
                    .from('profiles')
                    .update({
                        plan: 'free',
                        credits_remaining: 20,
                        lemon_subscription_id: null,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', userId);

                console.log(`[WEBHOOK] ⚠️ User ${userId} downgraded to free`);
                break;
            }

            default:
                console.log(`[WEBHOOK] Unhandled event: ${eventName}`);
        }

        return res.status(200).json({ message: 'OK' });

    } catch (error) {
        console.error('[WEBHOOK] Unexpected error:', error);
        return res.status(500).json({ error: 'Internal error' });
    }
}
