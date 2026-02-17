// src/api/openrouter.js - OpenRouter API Helpers
// DUAL MODE: Backend Proxy (production) or Direct API (development)

import { API_KEY, API_URL, VISION_URL, VISION_MODEL, USE_BACKEND } from './config.js';

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
    } catch (e) {
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
        } catch (e) {
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
                let lastChar = '';
                let cleaned = jsonStr.trim();

                const firstBrace = cleaned.indexOf('{');
                const firstBracket = cleaned.indexOf('[');
                if (firstBrace === -1 && firstBracket === -1) return "{}";
                const start = (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) ? firstBrace : firstBracket;
                cleaned = cleaned.substring(start);

                for (let i = 0; i < cleaned.length; i++) {
                    const char = cleaned[i];
                    lastChar = char;

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
    } catch (e) {
        // Final failure
    }

    // Final Failure
    const snippet = rawText.length > 200 ? rawText.substring(0, 200) + '...' : rawText;
    throw new Error(`❌ خطأ في تنسيق الاستجابة (JSON Error).\nالسبب: ${finishReason === 'length' ? 'انقطاع النص (Truncated)' : 'تنسيق غير صالح'}\n\nTechnical snippet:\n${snippet}`);
}

/**
 * Call OpenRouter API with text prompt
 * Supports both Backend Proxy and Direct API modes
 */
export async function callOpenRouter(userPrompt, model, returnRawText = false, maxTokens = 4000, temperature = null, systemMessage = null) {
    const finalTemp = temperature !== null ? temperature : (returnRawText ? 0.9 : 0.7);
    const MAX_RETRIES = 2;
    const TIMEOUT_MS = maxTokens > 15000 ? 120000 : 60000;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

            let response;

            if (USE_BACKEND) {
                // ===== BACKEND PROXY MODE (SAFE) =====
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: userPrompt,
                        model,
                        maxTokens,
                        temperature: finalTemp,
                        ...(systemMessage ? { systemPrompt: systemMessage } : {})
                    }),
                    signal: controller.signal
                });
            } else {
                // ===== DIRECT API MODE (DEVELOPMENT ONLY) =====
                if (!API_KEY || API_KEY === 'your_api_key_here') {
                    throw new Error('API Key not configured! Please add your key to .env file or start the backend server.');
                }

                response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`,
                        'HTTP-Referer': window.location.origin,
                        'X-Title': 'Kemo Prompt Engine'
                    },
                    body: JSON.stringify({
                        model,
                        messages: [
                            ...(systemMessage ? [{ role: 'system', content: systemMessage }] : []),
                            { role: 'user', content: userPrompt }
                        ],
                        max_tokens: maxTokens,
                        temperature: finalTemp,
                        top_p: 0.9
                    }),
                    signal: controller.signal
                });
            }

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error?.message || errorData.error || `API error ${response.status}`;

                if (response.status === 401 || response.status === 403) {
                    throw new Error(`Authentication failed: ${errorMessage}`);
                }
                if (response.status === 429 && attempt < MAX_RETRIES) {
                    const wait = Math.pow(2, attempt + 1) * 1000;
                    await new Promise(r => setTimeout(r, wait));
                    continue;
                }

                throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            }

            return await handleResponse(response, returnRawText);
        } catch (error) {
            if (error.name === 'AbortError') {
                const timeoutSec = TIMEOUT_MS / 1000;
                throw new Error(`Request timed out (${timeoutSec}s). Try simplifying your inputs.`);
            }
            if (attempt < MAX_RETRIES && !error.message.includes('Authentication')) {
                const wait = Math.pow(2, attempt + 1) * 1000;
                console.warn(`⚠️ Retry ${attempt + 1}/${MAX_RETRIES} in ${wait / 1000}s...`);
                await new Promise(r => setTimeout(r, wait));
                continue;
            }
            throw error;
        }
    }
}

/**
 * Call OpenRouter Vision API with image
 * Supports both Backend Proxy and Direct API modes
 */
export async function callOpenRouterVision(textPrompt, base64Image, mimeType) {
    const TIMEOUT_MS = 90000; // 90s for vision
    const MAX_RETRIES = 1;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

            let response;

            if (USE_BACKEND) {
                response = await fetch(VISION_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: textPrompt,
                        model: VISION_MODEL,
                        images: [{ url: `data:${mimeType};base64,${base64Image}` }]
                    }),
                    signal: controller.signal
                });
            } else {
                response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`,
                        'HTTP-Referer': window.location.origin,
                        'X-Title': 'Kemo Prompt Engine'
                    },
                    body: JSON.stringify({
                        model: VISION_MODEL,
                        messages: [{
                            role: 'user',
                            content: [
                                { type: 'text', text: textPrompt },
                                { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } }
                            ]
                        }]
                    }),
                    signal: controller.signal
                });
            }

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 429 && attempt < MAX_RETRIES) {
                    await new Promise(r => setTimeout(r, 3000));
                    continue;
                }
                throw new Error(errorData.error?.message || `Vision API error ${response.status}`);
            }

            return await handleResponse(response, false);
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Vision request timed out (90s). Try a smaller image.');
            }
            if (attempt < MAX_RETRIES) {
                console.warn(`⚠️ Vision retry ${attempt + 1}/${MAX_RETRIES}...`);
                await new Promise(r => setTimeout(r, 2000));
                continue;
            }
            throw error;
        }
    }
}

/**
 * Call Gemini with multiple images
 * Supports both Backend Proxy and Direct API modes
 */
export async function callGeminiMultiImage(textPrompt, imageContents) {
    const TIMEOUT_MS = 90000;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        let response;

        if (USE_BACKEND) {
            response = await fetch(VISION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: textPrompt,
                    model: VISION_MODEL,
                    images: imageContents.map(ic => ic.image_url || ic)
                }),
                signal: controller.signal
            });
        } else {
            response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Kemo Prompt Engine'
                },
                body: JSON.stringify({
                    model: VISION_MODEL,
                    messages: [{ role: 'user', content: [{ type: 'text', text: textPrompt }, ...imageContents] }]
                }),
                signal: controller.signal
            });
        }

        clearTimeout(timeoutId);
        return await handleResponse(response, false);
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Multi-image request timed out (90s).');
        }
        console.error("Gemini Error:", error);
        throw error;
    }
}
