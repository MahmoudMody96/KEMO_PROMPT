// ============================================================
// PROMPTFORGE BACKEND SERVER v1.0
// API Proxy — Protects OpenRouter API Key from frontend exposure
// ============================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from server/.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- CONFIGURATION ---
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

if (!OPENROUTER_API_KEY) {
    console.error('❌ OPENROUTER_API_KEY is not set in server/.env!');
    console.error('📝 Create server/.env with: OPENROUTER_API_KEY=sk-or-v1-...');
    process.exit(1);
}

// --- MIDDLEWARE ---
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['POST', 'GET'],
    credentials: true
}));
app.use(express.json({ limit: '5mb' })); // Large payloads for vision/images

// --- RATE LIMITING (Simple In-Memory) ---
const rateLimitMap = new Map();
const RATE_LIMIT = {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX) || 30,    // 30 requests
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000  // per minute
};

function checkRateLimit(clientId) {
    const now = Date.now();
    const clientData = rateLimitMap.get(clientId) || { count: 0, resetTime: now + RATE_LIMIT.windowMs };

    // Reset window if expired
    if (now > clientData.resetTime) {
        clientData.count = 0;
        clientData.resetTime = now + RATE_LIMIT.windowMs;
    }

    clientData.count++;
    rateLimitMap.set(clientId, clientData);

    return {
        allowed: clientData.count <= RATE_LIMIT.maxRequests,
        remaining: Math.max(0, RATE_LIMIT.maxRequests - clientData.count),
        resetIn: Math.ceil((clientData.resetTime - now) / 1000)
    };
}

// Clean up rate limit map every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of rateLimitMap) {
        if (now > data.resetTime + 60000) rateLimitMap.delete(key);
    }
}, 300000);

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        rateLimit: RATE_LIMIT
    });
});

// --- MAIN PROXY ENDPOINT: Text Generation ---
app.post('/api/generate', async (req, res) => {
    try {
        // Rate limiting by IP
        const clientId = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const rateCheck = checkRateLimit(clientId);

        if (!rateCheck.allowed) {
            return res.status(429).json({
                error: `Rate limit exceeded. Try again in ${rateCheck.resetIn}s`,
                remaining: 0,
                resetIn: rateCheck.resetIn
            });
        }

        const { prompt, model, maxTokens, temperature, systemPrompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Missing required field: prompt' });
        }

        // Build messages array
        const messages = [];
        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
        }
        messages.push({ role: 'user', content: prompt });

        // Forward to OpenRouter
        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': process.env.APP_URL || 'http://localhost:5173',
                'X-Title': 'PromptForge AI Studio'
            },
            body: JSON.stringify({
                model: model || 'google/gemini-2.0-flash-001',
                messages,
                max_tokens: Math.min(maxTokens || 16000, 30000), // Default 16K, cap at 30K
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

        // Add rate limit headers
        res.set('X-RateLimit-Remaining', rateCheck.remaining.toString());
        res.set('X-RateLimit-Reset', rateCheck.resetIn.toString());

        res.json(data);

    } catch (error) {
        console.error('[SERVER ERROR]', error.message);
        res.status(500).json({ error: 'Internal server error. Please try again.' });
    }
});

// --- VISION PROXY ENDPOINT ---
app.post('/api/vision', async (req, res) => {
    try {
        // Rate limiting
        const clientId = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const rateCheck = checkRateLimit(clientId);
        if (!rateCheck.allowed) {
            return res.status(429).json({ error: `Rate limit exceeded. Try again in ${rateCheck.resetIn}s` });
        }

        const { prompt, model, images } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Missing required field: prompt' });
        }

        // Build content array with text + images
        const content = [{ type: 'text', text: prompt }];
        if (images && Array.isArray(images)) {
            for (const img of images) {
                content.push({
                    type: 'image_url',
                    image_url: { url: img.url || img }
                });
            }
        }

        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': process.env.APP_URL || 'http://localhost:5173',
                'X-Title': 'PromptForge AI Studio'
            },
            body: JSON.stringify({
                model: model || 'google/gemini-2.0-flash-001',
                messages: [{ role: 'user', content }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return res.status(502).json({ error: errorData.error?.message || 'Vision API error' });
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error('[VISION ERROR]', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║  🚀 PromptForge Backend v1.0                 ║');
    console.log(`║  📡 Running on http://localhost:${PORT}          ║`);
    console.log(`║  🔒 API Key: ${OPENROUTER_API_KEY.slice(0, 12)}...  (PROTECTED) ║`);
    console.log(`║  ⚡ Rate Limit: ${RATE_LIMIT.maxRequests} req/${RATE_LIMIT.windowMs / 1000}s              ║`);
    console.log('╚══════════════════════════════════════════════╝');
    console.log('');
});
