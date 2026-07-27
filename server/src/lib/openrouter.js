// server/src/lib/openrouter.js — The only place the OpenRouter key is used.

import config from '../config.js';

export async function callOpenRouter(body) {
    return fetch(config.openRouter.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.openRouter.apiKey}`,
            'HTTP-Referer': config.appUrl || 'https://kemo-engine.local',
            'X-Title': 'Kemo Engine',
        },
        body: JSON.stringify(body),
    });
}

/** Pull a safe, human-readable message out of an upstream failure. */
export async function upstreamError(response) {
    const data = await response.json().catch(() => ({}));
    return data.error?.message || `OpenRouter error ${response.status}`;
}
