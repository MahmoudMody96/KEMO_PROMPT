// server/src/routes/ai.js — /api/generate and /api/vision
//
// Both charge before spending money upstream and refund when the upstream call
// produces nothing usable, so a failed generation never costs the user credits.

import express from 'express';
import config from '../config.js';
import { requireAuth } from '../auth/middleware.js';
import { chargeCredits, refundCredits, logUsage } from '../lib/credits.js';
import { callOpenRouter, upstreamError } from '../lib/openrouter.js';
import { makeLimiter } from '../lib/rateLimit.js';

const router = express.Router();

const MAX_PROMPT_CHARS = 60_000;
const MAX_SYSTEM_CHARS = 40_000;
const MAX_OUTPUT_TOKENS = 30_000;
const MAX_VISION_PROMPT = 20_000;
const MAX_VISION_TOKENS = 8_000;
const MAX_IMAGES = 6;
const MAX_IMAGE_CHARS = 1_500_000;    // ~1.1 MB of base64 per image
const MAX_TOTAL_IMAGE_CHARS = 4_000_000;
// Both come from config (OPENROUTER_MODEL / OPENROUTER_ALLOWED_MODELS) so the
// model can be changed in one place — server/.env — without touching code.
//
// Credits are priced per action, not per model. If the client could name any
// model it would buy an arbitrarily expensive completion at a fixed price, so
// anything outside this set silently falls back to the model we do price for.
const DEFAULT_MODEL = config.openRouter.model;
const ALLOWED_MODELS = new Set([DEFAULT_MODEL, ...config.openRouter.allowedModels]);

// The action *is* the price (see lib/credits.js), and the client names it. An
// allowlist alone would not help: /generate legitimately serves brainstorm,
// architect and trend_search at different rates, so a caller could always claim
// the cheapest one. What closes the hole is tying the resources an action buys
// to the price it pays — declare `brainstorm` and you get the brainstorm token
// budget, not a 30k-token screenplay for one credit.
const ACTION_LIMITS = Object.freeze({
    brainstorm: 2_500,
    trend_search: 4_000,
    architect: 8_000,
    generate: MAX_OUTPUT_TOKENS,
    extract: MAX_VISION_TOKENS,
});

/** Actions each route will price. Anything else falls back to the route default. */
const GENERATE_ACTIONS = new Set(['generate', 'architect', 'brainstorm', 'trend_search']);

const pickAction = (action, allowed, fallback) =>
    typeof action === 'string' && allowed.has(action) ? action : fallback;

const aiLimiter = makeLimiter({
    max: config.rateLimit.max,
    windowMs: config.rateLimit.windowMs,
    key: 'ai',
});

function normalizeImage(entry) {
    const url = typeof entry === 'string' ? entry : entry?.url || entry?.image_url?.url;
    if (typeof url !== 'string' || !url) return null;
    if (!/^(data:image\/|https:\/\/)/i.test(url)) return null;
    if (url.length > MAX_IMAGE_CHARS) return null;
    return url;
}

const pickModel = (model) =>
    typeof model === 'string' && ALLOWED_MODELS.has(model) ? model : DEFAULT_MODEL;

// --- POST /api/generate ------------------------------------------------
router.post('/generate', requireAuth, aiLimiter, async (req, res) => {
    const startedAt = Date.now();
    const userId = req.user.id;
    let charged = null;

    try {
        const { prompt, model, maxTokens, temperature, systemPrompt, action, expectJson } = req.body || {};

        if (typeof prompt !== 'string' || !prompt.trim()) {
            return res.status(400).json({ error: 'Missing required field: prompt' });
        }
        if (prompt.length > MAX_PROMPT_CHARS) {
            return res.status(413).json({ error: 'Prompt is too long' });
        }
        if (systemPrompt != null &&
            (typeof systemPrompt !== 'string' || systemPrompt.length > MAX_SYSTEM_CHARS)) {
            return res.status(413).json({ error: 'System prompt is too long' });
        }

        // Resolve the action first: it decides both the price and the token
        // budget, so the two can never diverge.
        const resolvedAction = pickAction(action, GENERATE_ACTIONS, 'generate');
        const actionCap = ACTION_LIMITS[resolvedAction] ?? MAX_OUTPUT_TOKENS;

        const requested = Number(maxTokens);
        const cappedTokens = Math.min(
            Number.isFinite(requested) && requested > 0 ? requested : 16_000,
            actionCap
        );
        const temp = Number(temperature);
        const safeTemp = Number.isFinite(temp) ? Math.min(Math.max(temp, 0), 2) : 0.7;

        const charge = await chargeCredits(userId, resolvedAction);
        if (!charge.ok) return res.status(charge.status).json({ error: charge.error });
        charged = charge.cost;

        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: prompt });

        // Resolve once and log THIS, not the raw request model. The client sends
        // no model, so logging req.body.model recorded '' for every request —
        // the admin activity log and any model-routing debugging saw a blank
        // where the real model belonged.
        const resolvedModel = pickModel(model);

        const response = await callOpenRouter({
            model: resolvedModel,
            messages,
            max_tokens: cappedTokens,
            temperature: safeTemp,
            top_p: 0.9,
            // Constrain the decoder to valid JSON when the caller is going to
            // parse it. Asking for JSON in the prompt alone produced fenced
            // blocks and unescaped quotes inside string values, which no
            // client-side repair could recover.
            ...(expectJson === true ? { response_format: { type: 'json_object' } } : {}),
        });

        if (!response.ok) {
            const message = await upstreamError(response);
            console.error(`[GENERATE] upstream ${response.status}: ${message}`);

            await refundCredits(userId, charged);
            charged = null;
            await logUsage(userId, resolvedAction, {
                model: resolvedModel, success: false, error: message, cost: 0, duration: Date.now() - startedAt,
            });

            // The upstream text is logged above but not relayed: provider errors
            // can echo request metadata and model routing internals.
            return res.status(response.status === 429 ? 429 : 502).json({
                error: response.status === 429
                    ? 'AI service rate limit. Please wait and retry.'
                    : 'AI service is unavailable right now. Please try again.',
            });
        }

        const data = await response.json();

        // A 200 is not proof of a usable answer. A model can return an empty
        // `content` — most often a reasoning model that spent the whole
        // max_tokens budget thinking (finish_reason "length"). That reached the
        // client as "AI returned empty response" AFTER the credits had already
        // been taken, so the user paid for nothing. Nothing delivered, nothing
        // charged.
        const text = data?.choices?.[0]?.message?.content;
        if (typeof text !== 'string' || !text.trim()) {
            const why = data?.choices?.[0]?.finish_reason === 'length'
                ? 'truncated before any content (token budget exhausted)'
                : 'empty content';
            console.error(`[GENERATE] unusable response from ${resolvedModel}: ${why}`);

            await refundCredits(userId, charged);
            charged = null;
            await logUsage(userId, resolvedAction, {
                model: resolvedModel, success: false, error: `empty response (${why})`,
                cost: 0, duration: Date.now() - startedAt,
            });

            return res.status(502).json({
                error: 'The AI returned an empty response. Your credits were not charged — please try again.',
            });
        }

        // When the caller asked for JSON, "delivered" means parseable JSON.
        // response_format above makes this the rare case, but a model that
        // ignores it would otherwise bill the user for output the client throws
        // away with "الاستجابة رجعت بتنسيق غير صالح". The fence strip mirrors
        // the client's first repair step so we only reject what it cannot use.
        if (expectJson === true) {
            const unfenced = text.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '');
            try {
                JSON.parse(unfenced);
            } catch {
                console.error(`[GENERATE] ${resolvedModel} returned unparseable JSON for ${resolvedAction}`);
                await refundCredits(userId, charged);
                charged = null;
                await logUsage(userId, resolvedAction, {
                    model: resolvedModel, success: false, error: 'unparseable JSON',
                    cost: 0, duration: Date.now() - startedAt,
                });
                return res.status(502).json({
                    error: 'The AI returned a malformed response. Your credits were not charged — please try again.',
                });
            }
        }

        const spent = charged;
        await logUsage(userId, resolvedAction, {
            model: resolvedModel,
            success: true,
            cost: spent,
            tokens: data?.usage?.total_tokens || 0,
            duration: Date.now() - startedAt,
        });

        // The generation was delivered, so the catch below must not refund it.
        charged = null;
        res.set('X-Credits-Charged', String(spent ?? 0));
        return res.json(data);

    } catch (err) {
        console.error('[GENERATE] error:', err.message);
        if (charged) await refundCredits(userId, charged);
        return res.status(500).json({ error: 'Internal server error. Please try again.' });
    }
});

// --- POST /api/vision --------------------------------------------------
router.post('/vision', requireAuth, aiLimiter, async (req, res) => {
    const startedAt = Date.now();
    const userId = req.user.id;
    let charged = null;

    try {
        // `action` is intentionally not read from the body here — vision is
        // always priced as an extraction. See the chargeCredits call below.
        // model is intentionally not read from the body: vision is pinned to the
        // configured vision model (extraction needs image support).
        const { prompt, images } = req.body || {};
        const visionModel = config.openRouter.visionModel;

        if (typeof prompt !== 'string' || !prompt.trim()) {
            return res.status(400).json({ error: 'Missing required field: prompt' });
        }
        if (prompt.length > MAX_VISION_PROMPT) {
            return res.status(413).json({ error: 'Prompt is too long' });
        }

        const raw = Array.isArray(images) ? images : [];
        if (raw.length > MAX_IMAGES) {
            return res.status(400).json({ error: `At most ${MAX_IMAGES} images per request` });
        }

        const urls = [];
        let total = 0;
        for (const entry of raw) {
            const url = normalizeImage(entry);
            if (!url) return res.status(400).json({ error: 'Invalid or oversized image payload' });
            total += url.length;
            if (total > MAX_TOTAL_IMAGE_CHARS) {
                return res.status(413).json({ error: 'Image payload is too large' });
            }
            urls.push(url);
        }

        // Vision is always priced as an extraction — not overridable from the
        // body, or a caller buys image analysis at the brainstorm rate.
        const charge = await chargeCredits(userId, 'extract');
        if (!charge.ok) return res.status(charge.status).json({ error: charge.error });
        charged = charge.cost;

        const response = await callOpenRouter({
            // Vision always uses the configured vision model, never the text
            // default or a client override: extraction requires image support,
            // and the text model may be a text-only one (deepseek, etc.).
            model: visionModel,
            messages: [{
                content: [
                    { type: 'text', text: prompt },
                    ...urls.map(url => ({ type: 'image_url', image_url: { url } })),
                ],
                role: 'user',
            }],
            // Without this the provider default applies and the completion is
            // unbounded — /generate has always capped, /vision never did.
            max_tokens: MAX_VISION_TOKENS,
        });

        if (!response.ok) {
            const message = await upstreamError(response);
            console.error(`[VISION] upstream ${response.status}: ${message}`);

            await refundCredits(userId, charged);
            charged = null;
            await logUsage(userId, 'extract', {
                model: visionModel, success: false, error: message, cost: 0, duration: Date.now() - startedAt,
            });

            return res.status(response.status === 429 ? 429 : 502).json({
                error: response.status === 429
                    ? 'AI service rate limit. Please wait and retry.'
                    : 'Image analysis is unavailable right now. Please try again.',
            });
        }

        const data = await response.json();

        // Same guard as /generate: a 200 carrying no content must not be billed.
        const text = data?.choices?.[0]?.message?.content;
        if (typeof text !== 'string' || !text.trim()) {
            console.error(`[VISION] unusable response from ${visionModel}: empty content`);
            await refundCredits(userId, charged);
            charged = null;
            await logUsage(userId, 'extract', {
                model: visionModel, success: false, error: 'empty response',
                cost: 0, duration: Date.now() - startedAt,
            });
            return res.status(502).json({
                error: 'The AI returned an empty response. Your credits were not charged — please try again.',
            });
        }

        const spent = charged;
        await logUsage(userId, 'extract', {
            model: visionModel,
            success: true,
            cost: spent,
            tokens: data?.usage?.total_tokens || 0,
            duration: Date.now() - startedAt,
        });

        charged = null;
        res.set('X-Credits-Charged', String(spent ?? 0));
        return res.json(data);

    } catch (err) {
        console.error('[VISION] error:', err.message);
        if (charged) await refundCredits(userId, charged);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
