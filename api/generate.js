// api/generate.js — Vercel Serverless Function
// Proxies text generation requests to OpenRouter (protects API key)

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map();
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX) || 30;
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW) || 60000;

function checkRateLimit(clientId) {
    const now = Date.now();
    const data = rateLimitMap.get(clientId) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    if (now > data.resetTime) { data.count = 0; data.resetTime = now + RATE_LIMIT_WINDOW; }
    data.count++;
    rateLimitMap.set(clientId, data);
    return {
        allowed: data.count <= RATE_LIMIT_MAX,
        remaining: Math.max(0, RATE_LIMIT_MAX - data.count),
        resetIn: Math.ceil((data.resetTime - now) / 1000)
    };
}

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
        if (!OPENROUTER_API_KEY) {
            return res.status(500).json({ error: 'Server not configured: missing API key' });
        }

        // Rate limit
        const clientId = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
        const rateCheck = checkRateLimit(clientId);
        if (!rateCheck.allowed) {
            return res.status(429).json({
                error: `Rate limit exceeded. Try again in ${rateCheck.resetIn}s`,
                remaining: 0, resetIn: rateCheck.resetIn
            });
        }

        const { prompt, model, maxTokens, temperature, systemPrompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Missing required field: prompt' });

        // Build messages
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: prompt });

        // Forward to OpenRouter
        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': process.env.APP_URL || 'https://promptforge.vercel.app',
                'X-Title': 'PromptForge AI Studio'
            },
            body: JSON.stringify({
                model: model || 'google/gemini-2.0-flash-001',
                messages,
                max_tokens: Math.min(maxTokens || 16000, 30000),
                temperature: temperature ?? 0.7,
                top_p: 0.9
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const status = response.status;
            const errorMsg = errorData.error?.message || `OpenRouter error ${status}`;
            console.error(`[PROXY ERROR] ${status}: ${errorMsg}`);
            return res.status(status === 429 ? 429 : 502).json({
                error: status === 429
                    ? 'AI service rate limit. Please wait and retry.'
                    : `AI service error: ${errorMsg}`
            });
        }

        const data = await response.json();
        res.setHeader('X-RateLimit-Remaining', rateCheck.remaining.toString());
        res.setHeader('X-RateLimit-Reset', rateCheck.resetIn.toString());
        return res.status(200).json(data);

    } catch (error) {
        console.error('[GENERATE ERROR]', error.message);
        return res.status(500).json({ error: 'Internal server error. Please try again.' });
    }
}
