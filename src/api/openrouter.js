// src/api/openrouter.js — Calls to our own AI endpoints.
//
// Everything goes through /api/generate and /api/vision on the same origin.
// The server holds the OpenRouter key, checks the session, and charges credits;
// the browser never sees a provider key and cannot pick its own price.

import { API_URL, VISION_URL } from './config.js';
import { ApiError } from '../lib/apiClient.js';
// The backend charges credits as part of the generation request, so the UI is
// told to re-read the balance instead of showing a stale number until reload.
import { notifyCreditsChanged } from '../lib/events.js';

/**
 * Thrown when the backend rejects a request for account reasons rather than
 * technical ones, so the UI can prompt for sign-in or an upgrade instead of
 * showing a generic failure.
 */
export class AccountError extends Error {
    constructor(message, kind) {
        super(message);
        this.name = 'AccountError';
        this.kind = kind; // 'auth' | 'credits'
    }
}

/** Turn a non-OK backend response into the right error type. */
async function toBackendError(response) {
    const body = await response.json().catch(() => ({}));
    const message = body.error?.message || body.error || `API error ${response.status}`;
    const text = typeof message === 'string' ? message : JSON.stringify(message);

    if (response.status === 401 || response.status === 403) {
        return new AccountError(text, 'auth');
    }
    if (response.status === 402) {
        return new AccountError(text, 'credits');
    }
    return new Error(text);
}

/** POST JSON to one of our endpoints, carrying the session cookie. */
function postJson(url, payload, signal) {
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
        signal,
    });
}

/**
 * Thrown when the upstream call succeeded (and was therefore charged) but the
 * body could not be parsed. Distinct from a transport failure: retrying buys a
 * second billed generation and cannot fix malformed output.
 */
export class ResponseFormatError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ResponseFormatError';
    }
}

/** Sign-in, credit and parse problems will not fix themselves on retry. */
const isTerminal = (error) =>
    error instanceof AccountError ||
    error instanceof ApiError ||
    error instanceof ResponseFormatError;

/**
 * Convert file to Base64
 */
export const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

/**
 * Helper: robustly extract JSON object or array from text
 * Handles mixed content and nested structures correctly
 */
function extractJson(text) {
    let startIndex = text.indexOf('{');
    let arrayStartIndex = text.indexOf('[');

    // Determine which comes first (object or array)
    let isArray = false;
    if (arrayStartIndex !== -1 && (startIndex === -1 || arrayStartIndex < startIndex)) {
        startIndex = arrayStartIndex;
        isArray = true;
    }

    if (startIndex === -1) return null;

    let openChar = isArray ? '[' : '{';
    let closeChar = isArray ? ']' : '}';
    let balance = 0;
    let quote = null;
    let escape = false;

    for (let i = startIndex; i < text.length; i++) {
        let char = text[i];

        if (escape) {
            escape = false;
            continue;
        }

        if (char === '\\') {
            escape = true;
            continue;
        }

        if (quote) {
            if (char === quote) {
                quote = null;
            }
        } else {
            if (char === '"') { // Only double quotes are valid in JSON
                quote = char;
            } else if (char === openChar) {
                balance++;
            } else if (char === closeChar) {
                balance--;
                if (balance === 0) {
                    return text.substring(startIndex, i + 1);
                }
            }
        }
    }

    // If we're here, it might be truncated. Return what we have so far
    return text.substring(startIndex);
}

/**
 * Handle API response - parse JSON or return raw text
 */
export async function handleResponse(response, returnRawText) {
    const data = await response.json();
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
    if (!data.choices || !data.choices[0]?.message?.content) throw new Error("AI returned empty response.");

    let rawText = data.choices[0].message.content;

    // Check truncation
    const finishReason = data.choices[0]?.finish_reason;

    if (returnRawText) return rawText;

    // Strategy 1: Direct Parse (Best Case)
    try {
        return JSON.parse(rawText);
    } catch {
        // Continue to other strategies
    }

    // Clean up markdown
    let cleanText = rawText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '');

    // Strategy 2: Robust Extraction
    const extracted = extractJson(cleanText);
    if (extracted) {
        try {
            return JSON.parse(extracted);
        } catch {
            cleanText = extracted;
        }
    }

    // Strategy 3: Surgical Repair (Stack-Based)
    if (finishReason === 'length' || !extracted) {
        try {
            const repairTruncatedJson = (jsonStr) => {
                let stack = [];
                let isString = false;
                let escaped = false;
                let cleaned = jsonStr.trim();

                const firstBrace = cleaned.indexOf('{');
                const firstBracket = cleaned.indexOf('[');
                if (firstBrace === -1 && firstBracket === -1) return "{}";
                const start = (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) ? firstBrace : firstBracket;
                cleaned = cleaned.substring(start);

                for (let i = 0; i < cleaned.length; i++) {
                    const char = cleaned[i];

                    if (escaped) {
                        escaped = false;
                        continue;
                    }

                    if (char === '\\') {
                        escaped = true;
                        continue;
                    }

                    if (char === '"') {
                        isString = !isString;
                        continue;
                    }

                    if (!isString) {
                        if (char === '{') stack.push('}');
                        else if (char === '[') stack.push(']');
                        else if (char === '}' || char === ']') {
                            if (stack.length > 0 && stack[stack.length - 1] === char) {
                                stack.pop();
                            }
                        }
                    }
                }

                let repaired = cleaned;
                if (isString) repaired += '"';
                repaired = repaired.replace(/,\s*$/, '');
                if (repaired.trim().endsWith(':')) repaired += ' ""';

                if (!isString) {
                    if (/t$|tr$|tru$/.test(repaired)) repaired = repaired.replace(/t$|tr$|tru$/, 'true');
                    else if (/f$|fa$|fal$|fals$/.test(repaired)) repaired = repaired.replace(/f$|fa$|fal$|fals$/, 'false');
                    else if (/n$|nu$|nul$/.test(repaired)) repaired = repaired.replace(/n$|nu$|nul$/, 'null');
                }

                while (stack.length > 0) {
                    repaired += stack.pop();
                }

                return repaired;
            };

            const fixedJson = repairTruncatedJson(cleanText);
            return JSON.parse(fixedJson);
        } catch (e) {
            console.warn("Strategy 3 (Surgical Repair) failed:", e);
        }
    }

    // Strategy 4: Aggressive Repair
    try {
        let repairedJson = cleanText
            .replace(/\/\/.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/'/g, '"')
            .replace(/(\w+):/g, '"$1":')
            .replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']');

        const reExtracted = extractJson(repairedJson);
        return JSON.parse(reExtracted || repairedJson);
    } catch {
        // Final failure
    }

    // Final Failure
    // No raw model output in the message: it is rendered straight to the user
    // and can carry hundreds of characters of unrelated text. The detail goes to
    // the console for debugging instead.
    console.error('[AI] unparseable response:', rawText.slice(0, 500));
    throw new ResponseFormatError(
        finishReason === 'length'
            ? '❌ الاستجابة انقطعت قبل ما تكتمل (Truncated). جرّب تبسّط المدخلات أو تقلّل عدد المشاهد.'
            : '❌ الاستجابة رجعت بتنسيق غير صالح. جرّب تاني.'
    );
}

/**
 * Call the text generation endpoint.
 * `action` decides the credit price — the server maps it, we only name it.
 */
export async function callOpenRouter(
    userPrompt, model, returnRawText = false, maxTokens = 4000,
    temperature = null, systemMessage = null, action = 'generate'
) {
    const finalTemp = temperature !== null ? temperature : (returnRawText ? 0.9 : 0.7);
    const MAX_RETRIES = 2;
    const TIMEOUT_MS = maxTokens > 15000 ? 120000 : 60000;

    // Only the request is retried. Parsing happens after the loop, because a
    // 200 has already been charged server-side: retrying a response we cannot
    // parse buys a second (and third) billed generation and still fails.
    let response;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        try {
            response = await postJson(API_URL, {
                prompt: userPrompt,
                model,
                maxTokens,
                temperature: finalTemp,
                action,
                ...(systemMessage ? { systemPrompt: systemMessage } : {}),
            }, controller.signal);

            if (response.ok) break;

            if (response.status === 429 && attempt < MAX_RETRIES) {
                await new Promise(r => setTimeout(r, Math.pow(2, attempt + 1) * 1000));
                continue;
            }
            throw await toBackendError(response);

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`Request timed out (${TIMEOUT_MS / 1000}s). Try simplifying your inputs.`);
            }
            if (attempt < MAX_RETRIES && !isTerminal(error)) {
                const wait = Math.pow(2, attempt + 1) * 1000;
                console.warn(`⚠️ Retry ${attempt + 1}/${MAX_RETRIES} in ${wait / 1000}s...`);
                await new Promise(r => setTimeout(r, wait));
                continue;
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    notifyCreditsChanged();
    return handleResponse(response, returnRawText);
}

/** Call the vision endpoint with a single image. */
export async function callOpenRouterVision(textPrompt, base64Image, mimeType) {
    const TIMEOUT_MS = 90000;
    const MAX_RETRIES = 1;

    // Same rule as callOpenRouter: retry the request, never the parse.
    let response;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        try {
            response = await postJson(VISION_URL, {
                prompt: textPrompt,
                action: 'extract',
                images: [{ url: `data:${mimeType};base64,${base64Image}` }],
            }, controller.signal);

            if (response.ok) break;

            if (response.status === 429 && attempt < MAX_RETRIES) {
                await new Promise(r => setTimeout(r, 3000));
                continue;
            }
            throw await toBackendError(response);

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Vision request timed out (90s). Try a smaller image.');
            }
            if (attempt < MAX_RETRIES && !isTerminal(error)) {
                console.warn(`⚠️ Vision retry ${attempt + 1}/${MAX_RETRIES}...`);
                await new Promise(r => setTimeout(r, 2000));
                continue;
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    notifyCreditsChanged();
    return handleResponse(response, false);
}

/** Call the vision endpoint with several images at once. */
export async function callGeminiMultiImage(textPrompt, imageContents) {
    const TIMEOUT_MS = 90000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await postJson(VISION_URL, {
            prompt: textPrompt,
            action: 'extract',
            images: imageContents.map(ic => ic.image_url || ic),
        }, controller.signal);

        if (!response.ok) throw await toBackendError(response);

        notifyCreditsChanged();
        return await handleResponse(response, false);

    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Multi-image request timed out (90s).');
        }
        console.error('Vision error:', error);
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}
