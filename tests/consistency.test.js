// tests/consistency.test.js — Character consistency by construction.
//
// Run with `npm test` (node:test, no dependencies).
//
// The screenplay system prompt contains a "CHARACTER LOCK PROTOCOL" instructing
// the model to repeat each character's canonical description verbatim in every
// scene. That is compliance, not a guarantee: the observed failure modes were
// paraphrasing the costume, changing a colour between scenes, and omitting the
// CREF prefix entirely on later scenes of long screenplays.
//
// enforceConsistency() rewrites the reference from the character sheet after
// the fact, so the invariant below holds no matter what the model returned:
//
//   for every scene S and every character C appearing in S,
//   S.scene_prompt contains C's canonical descriptor byte-for-byte.
//
// Each test feeds output that a drifting model actually produces.

import test from 'node:test';
import assert from 'node:assert/strict';

import {
    enforceConsistency, auditConsistency, canonicalDescriptor,
} from '../src/api/engines/consistencyLock.js';

const hero = {
    name_en: 'Luna',
    name_ar: 'لونا',
    screenplay_description: 'CHARACTER: Luna | TYPE: Explorer | PHYSICAL: small',
    image_prompt: 'young explorer in a red canvas jacket, short black hair, brass compass pendant, scuffed leather boots, 8k, octane render, --ar 16:9',
};

const sidekick = {
    name_en: 'Pip',
    name_ar: 'بيب',
    image_prompt: 'small copper robot, single round blue lens, dented shoulder plate, masterpiece, best quality',
};

const build = (scenes) => ({ characters: [hero, sidekick], scenes });

test('render keywords are stripped from the canonical descriptor', () => {
    const d = canonicalDescriptor(hero);
    assert.ok(d.includes('red canvas jacket'));
    // Repeating these inside every CREF spends the image model's attention on
    // instructions the scene_prompt already carries at the end.
    for (const noise of ['8k', 'octane render', '--ar']) {
        assert.ok(!d.toLowerCase().includes(noise), `descriptor still contains "${noise}"`);
    }
});

test('a paraphrased description is replaced with the canonical one', () => {
    // The classic drift: same character, different words.
    const out = enforceConsistency(build([
        { scene_number: 1, scene_prompt: 'CREF: Luna - a girl in a crimson coat with dark hair. She climbs a ridge at dawn.' },
    ]));
    const p = out.screenplay.scenes[0].scene_prompt;
    assert.ok(p.includes('red canvas jacket'), 'canonical descriptor missing');
    assert.ok(!p.includes('crimson coat'), 'paraphrase survived');
    assert.ok(p.includes('She climbs a ridge at dawn.'), 'scene content was destroyed');
    assert.equal(out.report.enforced, 1);
});

test('a missing CREF is added without losing the scene', () => {
    const out = enforceConsistency(build([
        { scene_number: 4, scene_prompt: 'Luna stands on the cliff edge, wide shot, golden hour.' },
    ]));
    const p = out.screenplay.scenes[0].scene_prompt;
    assert.ok(p.startsWith('CREF: Luna - '));
    assert.ok(p.includes('Luna stands on the cliff edge, wide shot, golden hour.'));
});

test('enforcement is idempotent — re-running does not stack CREFs', () => {
    const once = enforceConsistency(build([
        { scene_number: 1, scene_prompt: 'Luna walks through fog.' },
    ]));
    const twice = enforceConsistency(once.screenplay);
    assert.equal(twice.report.enforced, 0, 'second pass should find nothing to change');
    assert.equal(twice.screenplay.scenes[0].scene_prompt, once.screenplay.scenes[0].scene_prompt);
    assert.equal((twice.screenplay.scenes[0].scene_prompt.match(/CREF:/g) || []).length, 1);
});

test('a scene with two characters anchors both', () => {
    const out = enforceConsistency(build([
        { scene_number: 2, scene_prompt: 'Luna and Pip argue beside the fire.' },
    ]));
    const p = out.screenplay.scenes[0].scene_prompt;
    assert.ok(p.includes('red canvas jacket'), 'hero descriptor missing');
    assert.ok(p.includes('single round blue lens'), 'sidekick descriptor missing');
});

test('a character absent from a scene is not injected into it', () => {
    const out = enforceConsistency(build([
        { scene_number: 3, scene_prompt: 'Pip rolls alone down a corridor.' },
    ]));
    const p = out.screenplay.scenes[0].scene_prompt;
    assert.ok(p.includes('single round blue lens'));
    assert.ok(!p.includes('red canvas jacket'), 'absent character was added to the scene');
});

test('the invariant holds across a whole drifting screenplay', () => {
    // Scene 1 compliant, 2 paraphrased, 3 recoloured, 4 missing entirely —
    // the exact shape of a long-screenplay drift.
    const out = enforceConsistency(build([
        { scene_number: 1, scene_prompt: 'CREF: Luna - young explorer in a red canvas jacket. Opening shot.' },
        { scene_number: 2, scene_prompt: 'CREF: Luna - explorer girl, dark hair. Mid shot.' },
        { scene_number: 3, scene_prompt: 'CREF: Luna - young explorer in a BLUE canvas jacket. Close up.' },
        { scene_number: 4, scene_prompt: 'Luna reaches the summit.' },
    ]));

    const audit = auditConsistency(out.screenplay);
    assert.equal(audit.consistent, true, `drift remained: ${JSON.stringify(audit.drift)}`);

    // And the recoloured jacket is genuinely gone, not merely accompanied by
    // a correct copy.
    assert.ok(!out.screenplay.scenes[2].scene_prompt.includes('BLUE canvas jacket'));
});

test('the audit detects drift that enforcement has not been run on', () => {
    const drifting = build([
        { scene_number: 1, scene_prompt: 'CREF: Luna - a totally different person. Shot.' },
    ]);
    const audit = auditConsistency(drifting);
    assert.equal(audit.consistent, false);
    assert.deepEqual(audit.drift, [{ scene: 1, character: 'Luna' }]);
});

test('degenerate input is passed through rather than corrupted', () => {
    for (const bad of [null, {}, { characters: [], scenes: [] }, { characters: [hero] }]) {
        const out = enforceConsistency(bad);
        assert.equal(out.report.enforced, 0);
        assert.equal(out.screenplay, bad, 'input should be returned untouched');
    }
    // A character with no usable description must not produce "CREF: X - ".
    const out = enforceConsistency({
        characters: [{ name_en: 'Ghost' }],
        scenes: [{ scene_number: 1, scene_prompt: 'Ghost drifts by.' }],
    });
    assert.equal(out.screenplay.scenes[0].scene_prompt, 'Ghost drifts by.');
});

test('a scene_prompt that is only a CREF keeps its text', () => {
    const out = enforceConsistency(build([
        { scene_number: 1, scene_prompt: 'CREF: Luna - young explorer in a red canvas jacket' },
    ]));
    assert.ok(out.screenplay.scenes[0].scene_prompt.length > 20);
    assert.ok(out.screenplay.scenes[0].scene_prompt.includes('red canvas jacket'));
});
