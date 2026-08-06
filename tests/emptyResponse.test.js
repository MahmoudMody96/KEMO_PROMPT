// tests/emptyResponse.test.js — "a 200 is not proof of an answer".
//
// Run with `npm test` (node:test, no dependencies).
//
// A reasoning model counts its private thinking against max_tokens. Observed in
// production with qwen3.7-flash on the brainstorm action: max_tokens 1800 ->
// reasoning_tokens 1800, `content` empty, finish_reason "length". OpenRouter
// answered 200, so the server logged a success and kept the user's credits,
// while the browser threw "AI returned empty response". The user paid for
// nothing and saw only an error.
//
// Two defences, both asserted here:
//   1. the upstream request disables reasoning, so the budget buys output;
//   2. the route treats a contentless 200 as a failure (refund + 502).

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const routeSrc = readFileSync(new URL('../server/src/routes/ai.js', import.meta.url), 'utf8');
const clientSrc = readFileSync(new URL('../server/src/lib/openrouter.js', import.meta.url), 'utf8');

// The predicate the routes use, mirrored so the table below documents exactly
// which upstream shapes count as unusable.
const isUnusable = (data) => {
    const text = data?.choices?.[0]?.message?.content;
    return typeof text !== 'string' || !text.trim();
};

const reply = (content, extra = {}) => ({
    choices: [{ finish_reason: 'stop', message: { role: 'assistant', content }, ...extra }],
});

test('the upstream call disables reasoning', () => {
    // Without this the token budget can be spent entirely on hidden reasoning.
    assert.match(clientSrc, /reasoning:\s*{\s*enabled:\s*false\s*}/);
    // It must be a default the caller can still override, not a hard override
    // that would stop a future action from opting back in.
    const idx = clientSrc.indexOf('reasoning: { enabled: false }');
    const spread = clientSrc.indexOf('...body');
    assert.ok(idx > -1 && spread > idx, 'body spread must come after the default');
});

test('both AI routes reject a contentless 200 instead of billing it', () => {
    // /generate and /vision each need the guard; the vision path was the one
    // that silently charged for an extraction that produced nothing.
    const guards = routeSrc.match(/typeof text !== 'string' \|\| !text\.trim\(\)/g) || [];
    assert.equal(guards.length, 2, 'expected the empty-content guard on both routes');

    // The guard must refund before returning, and must not log a success.
    const refunds = routeSrc.match(/await refundCredits\(userId, charged\)/g) || [];
    assert.ok(refunds.length >= 4, 'each route refunds on upstream error AND on empty content');
});

test('classifies upstream payloads correctly', () => {
    const cases = [
        ['reasoning ate the whole budget', { choices: [{ finish_reason: 'length', message: { content: '', reasoning: 'x'.repeat(500) } }] }, true],
        ['whitespace only', reply('   \n\t '), true],
        ['content is null', reply(null), true],
        ['no choices at all', {}, true],
        ['choices empty', { choices: [] }, true],
        ['real answer', reply('{"ideas":[]}'), false],
        ['single character', reply('#'), false],
    ];
    for (const [label, payload, unusable] of cases) {
        assert.equal(isUnusable(payload), unusable, label);
    }
});

test('the refusal tells the user their credits are safe', () => {
    // If the message did not say this, a user watching their balance would
    // reasonably assume they had just paid for the failure.
    assert.match(routeSrc, /credits were not charged/i);
});
