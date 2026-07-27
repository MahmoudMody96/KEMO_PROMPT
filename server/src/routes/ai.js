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
const MAX_IMAGES = 6;
const MAX_IMAGE_CHARS = 8_000_000;    // ~6 MB of base64
const MAX_TOTAL_IMAGE_CHARS = 20_000_000;
const DEFAULT_MODEL = 'google/gemini-2.0-flash-001';

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
    typeof model === 'string' && model ? model : DEFAULT_MODEL;

// --- POST /api/generate ------------------------------------------------
router.post('/generate', requireAuth, aiLimiter, async (req, res) => {
    const startedAt = Date.now();
    const userId = req.user.id;
    let charged = null;

    try {
        const { prompt, model, maxTokens, temperature, systemPrompt, action } = req.body || {};

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

        const requested = Number(maxTokens);
        const cappedTokens = Math.min(
            Number.isFinite(requested) && requested > 0 ? requested : 16_000,
            MAX_OUTPUT_TOKENS
        );
        const temp = Number(temperature);
        const safeTemp = Number.isFinite(temp) ? Math.min(Math.max(temp, 0), 2) : 0.7;

        const charge = await chargeCredits(userId, action);
        if (!charge.ok) return res.status(charge.status).json({ error: charge.error });
        charged = charge.cost;

        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: prompt });

        const response = await callOpenRouter({
            model: pickModel(model),
            messages,
            max_tokens: cappedTokens,
            temperature: safeTemp,
            top_p: 0.9,
        });

        if (!response.ok) {
            const message = await upstreamError(response);
            console.error(`[GENERATE] upstream ${response.status}: ${message}`);

            await refundCredits(userId, charged);
            charged = null;
            await logUsage(userId, action, {
                model, success: false, error: message, cost: 0, duration: Date.now() - startedAt,
            });

            return res.status(response.status === 429 ? 429 : 502).json({
                error: response.status === 429
                    ? 'AI service rate limit. Please wait and retry.'
                    : `AI service error: ${message}`,
            });
        }

        const data = await response.json();
        await logUsage(userId, action, {
            model,
            success: true,
            cost: charged,
            tokens: data?.usage?.total_tokens || 0,
            summary: prompt.slice(0, 200),
            duration: Date.now() - startedAt,
        });

        res.set('X-Credits-Charged', String(charged ?? 0));
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
        const { prompt, model, images, action } = req.body || {};

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

        const charge = await chargeCredits(userId, action || 'extract');
        if (!charge.ok) return res.status(charge.status).json({ error: charge.error });
        charged = charge.cost;

        const response = await callOpenRouter({
            model: pickModel(model),
            messages: [{
                content: [
                    { type: 'text', text: prompt },
                    ...urls.map(url => ({ type: 'image_url', image_url: { url } })),
                ],
                role: 'user',
            }],
        });

        if (!response.ok) {
            const message = await upstreamError(response);
            console.error(`[VISION] upstream ${response.status}: ${message}`);

            await refundCredits(userId, charged);
            charged = null;
            await logUsage(userId, action || 'extract', {
                model, success: false, error: message, cost: 0, duration: Date.now() - startedAt,
            });

            return res.status(response.status === 429 ? 429 : 502).json({ error: message });
        }

        const data = await response.json();
        await logUsage(userId, action || 'extract', {
            model,
            success: true,
            cost: charged,
            tokens: data?.usage?.total_tokens || 0,
            duration: Date.now() - startedAt,
        });

        res.set('X-Credits-Charged', String(charged ?? 0));
        return res.json(data);

    } catch (err) {
        console.error('[VISION] error:', err.message);
        if (charged) await refundCredits(userId, charged);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
