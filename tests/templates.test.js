// tests/templates.test.js — Template variable substitution.
//
// Run with `npm test` (node:test, no dependencies).
//
// The template library ships prompts containing {{VARIABLE}} markers plus one
// conditional form, {{VAR ? 'literal' + VAR : ''}}. Two bugs made the filled
// output wrong in ways that only showed up in the final prompt text:
//
//   1. The conditional was split with /(.+?)\s*:\s*(.+?)/, which matched the
//      FIRST colon — including one inside a quoted literal. The shipped
//      "6. **Special Focus:** " branch therefore rendered as "'6. **Special Focus".
//   2. Substitution used the string form of String#replace, so a value
//      containing $&, $1 or $` was interpreted as a backreference. Pasting a
//      regex or shell snippet into a variable silently corrupted the prompt.
//
// Both are asserted below, along with a sweep proving no template in the
// library leaves an unresolved marker on either the filled or the blank path.

import test from 'node:test';
import assert from 'node:assert/strict';

import PROMPT_TEMPLATES, { fillTemplate, getTemplateById } from '../src/api/promptTemplates.js';

const allTemplates = Object.entries(PROMPT_TEMPLATES).flatMap(
    ([domain, list]) => list.map((tmpl) => ({ domain, tmpl })),
);

test('a colon inside a quoted literal does not split the conditional', () => {
    const tmpl = getTemplateById('sw_code_review');
    const filled = fillTemplate(tmpl.template, {
        LANGUAGE: 'Python', CODE_SNIPPET: 'x', FOCUS_AREA: 'concurrency',
    });
    const line = filled.split('\n').find((l) => l.includes('Special Focus'));
    assert.equal(line, '6. **Special Focus:** concurrency');
    assert.ok(!filled.includes("'"), 'the literal quotes must not survive into the output');
});

test('an unset conditional variable drops its whole clause', () => {
    const tmpl = getTemplateById('sw_code_review');
    const filled = fillTemplate(tmpl.template, {
        LANGUAGE: 'Python', CODE_SNIPPET: 'x', FOCUS_AREA: '',
    });
    assert.ok(!filled.includes('Special Focus'));
    assert.ok(!/\{\{/.test(filled));
});

test('values containing $-patterns are inserted verbatim', () => {
    // String#replace would read $&, $` and $1 as backreferences here.
    const payload = 'const re = /$&/; const b = $`; const c = $1;';
    assert.equal(
        fillTemplate('Code: {{CODE_SNIPPET}}', { CODE_SNIPPET: payload }),
        `Code: ${payload}`,
    );
});

test('a blank variable becomes a visible [NAME] marker', () => {
    assert.equal(fillTemplate('{{A}}', { A: '' }), '[A]');
    assert.equal(fillTemplate('{{A}}', { A: undefined }), '[A]');
});

test('surrounding whitespace inside the braces is tolerated', () => {
    assert.equal(fillTemplate('{{ A }}', { A: 'v' }), 'v');
});

test('every template declares the variables its body uses', () => {
    const missing = [];
    for (const { domain, tmpl } of allTemplates) {
        // Bare {{NAME}} markers only — conditionals carry their own expression.
        const used = new Set(
            [...tmpl.template.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1]),
        );
        const declared = new Set(tmpl.variables || []);
        for (const name of used) {
            if (!declared.has(name)) missing.push(`${domain}/${tmpl.id}: ${name}`);
        }
    }
    assert.deepEqual(missing, [], 'undeclared variables never get a form field, so they render as [NAME]');
});

test('no template leaves an unresolved marker, filled or blank', () => {
    const residue = [];
    for (const { domain, tmpl } of allTemplates) {
        const names = tmpl.variables || [];
        for (const [label, value] of [['filled', (v) => `VALUE_${v}`], ['blank', () => '']]) {
            const vars = Object.fromEntries(names.map((v) => [v, value(v)]));
            const out = fillTemplate(tmpl.template, vars);
            if (/\{\{/.test(out)) residue.push(`${domain}/${tmpl.id} (${label})`);
        }
    }
    assert.deepEqual(residue, []);
});

test('the library is non-empty and every template is usable', () => {
    assert.ok(allTemplates.length > 0);
    for (const { domain, tmpl } of allTemplates) {
        assert.ok(tmpl.id, `${domain}: template without an id`);
        assert.ok(tmpl.template?.trim(), `${domain}/${tmpl.id}: empty body`);
        assert.ok(tmpl.title?.en && tmpl.title?.ar, `${domain}/${tmpl.id}: needs both languages`);
    }
});
