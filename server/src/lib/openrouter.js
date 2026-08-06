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
        body: JSON.stringify({
            // Reasoning tokens are billed and counted against max_tokens, and a
            // reasoning model will happily spend the ENTIRE budget thinking and
            // return an empty `content`. Observed with qwen3.7-flash on the
            // brainstorm action: max_tokens 1800 -> reasoning_tokens 1800,
            // content length 0, finish_reason "length". The user saw
            // "AI returned empty response" and was charged for it.
            //
            // Every prompt this app sends already carries an explicit,
            // step-by-step protocol and asks for structured JSON, so the private
            // chain-of-thought buys nothing here — it only adds latency, cost and
            // this failure mode. Models without a reasoning mode ignore the flag.
            reasoning: { enabled: false },
            ...body,
        }),
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
}

/** Pull a safe, human-readable message out of an upstream failure. */
export async function upstreamError(response) {
    const data = await response.json().catch(() => ({}));
    return data.error?.message || `OpenRouter error ${response.status}`;
}
