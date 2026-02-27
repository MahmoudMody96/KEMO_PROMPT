// ============================================================
// CREATE CHECKOUT — Vercel Serverless Function
// Creates a LemonSqueezy checkout session via API
// and returns the checkout URL to the frontend.
// ============================================================

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { variantId, userId, userEmail } = req.body;

        if (!variantId) {
            return res.status(400).json({ error: 'variantId is required' });
        }

        const apiKey = process.env.LEMONSQUEEZY_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        const storeId = process.env.VITE_LEMONSQUEEZY_STORE_ID;
        if (!storeId) {
            return res.status(500).json({ error: 'Store ID not configured' });
        }

        // Create checkout via LemonSqueezy API
        const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                data: {
                    type: 'checkouts',
                    attributes: {
                        checkout_data: {
                            email: userEmail || undefined,
                            custom: {
                                user_id: userId || '',
                            },
                        },
                        product_options: {
                            redirect_url: `${req.headers.origin || 'https://kemo-prompt.vercel.app'}/`,
                        },
                    },
                    relationships: {
                        store: {
                            data: { type: 'stores', id: String(storeId) },
                        },
                        variant: {
                            data: { type: 'variants', id: String(variantId) },
                        },
                    },
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('[CHECKOUT] LemonSqueezy API error:', response.status, errorData);
            return res.status(response.status).json({
                error: 'Failed to create checkout',
                details: errorData,
            });
        }

        const data = await response.json();
        const checkoutUrl = data.data?.attributes?.url;

        if (!checkoutUrl) {
            return res.status(500).json({ error: 'No checkout URL returned' });
        }

        console.log(`[CHECKOUT] ✅ Created checkout for variant ${variantId}`);
        return res.status(200).json({ url: checkoutUrl });

    } catch (error) {
        console.error('[CHECKOUT] Error:', error);
        return res.status(500).json({ error: 'Internal error' });
    }
}
