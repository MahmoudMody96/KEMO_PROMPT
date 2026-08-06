// server/src/lib/openrouter.js — The only place the OpenRouter key is used.

import config from '../config.js';

// Long enough for a 30k-token completion, short enough that a hung provider
// does not pin an Express handler (and the user's already-deducted credits)
// until the platform kills the request.
const UPSTREAM_TIMEOUT_MS = 120_000;

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
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
}

/** Pull a safe, human-readable message out of an upstream failure. */
export async function upstreamError(response) {
    const data = await response.json().catch(() => ({}));
    return data.error?.message || `OpenRouter error ${response.status}`;
}
