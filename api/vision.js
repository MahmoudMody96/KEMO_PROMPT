// api/vision.js — Vercel Serverless Function
// Proxies vision/image requests to OpenRouter

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

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

        const { prompt, model, images } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Missing required field: prompt' });

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
                'HTTP-Referer': process.env.APP_URL || 'https://promptforge.vercel.app',
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
        return res.status(200).json(data);

    } catch (error) {
        console.error('[VISION ERROR]', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
