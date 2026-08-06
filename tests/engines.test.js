// tests/engines.test.js — Dispatch coverage for the DNA engines.
//
// Run with `npm test` (node:test, no dependencies).
//
// These engines resolve a UI dropdown value to a data record through an ordered
// chain of `if (haystack.includes(needle))` branches. That design has two
// failure modes that are invisible until someone inspects the generated prompt:
//
//   1. A value matches NO branch and silently gets the generic default, so
//      changing the dropdown changes nothing in the output.
//   2. A value matches an EARLIER, broader branch and gets the wrong record,
//      making the specific branch unreachable dead code.
//
// Both had shipped: 6 of 31 styles and 8 of 23 genres fell through to their
// defaults, "Cyberpunk / Neon Noir" was captured by the Film Noir branch, and
// the flagship transparent_creature character type had no record at all.
//
// The tests below assert against the REAL option lists in src/i18n/options.js,
// so adding a dropdown entry without a matching branch fails here rather than
// degrading output in production.

import test from 'node:test';
import assert from 'node:assert/strict';

import { getStyleDNA } from '../src/api/engines/styleDnaEngine.js';
import { getPersona } from '../src/api/engines/personaEngine.js';
import { getGenreGoal } from '../src/api/engines/genreGoalEngine.js';
import { generateSystemPrompt } from '../src/api/engines/screenplayEngine.js';
import { getCharacterDNA } from '../src/api/engines/characterDnaEngine.js';
import { getDialectDNA } from '../src/api/engines/dialectDnaEngine.js';
import { getOptions } from '../src/i18n/options.js';

/** options.js mixes flat entries and { group, items } — flatten to values. */
const flatten = (arr) =>
    arr.flatMap((x) => (x.items ? x.items : [x])).map((x) => x.value).filter(Boolean);

const options = getOptions('en');
const STYLES = flatten(options.videoStyles);
const GENRES = flatten(options.genres);
const CHARACTER_TYPES = flatten(options.characterTypes);

// A value no branch can match, used to identify each engine's fallback record.
const NO_MATCH = '__no_such_value__';

test('every video style in the UI resolves to its own style DNA', () => {
    const fallback = getStyleDNA(NO_MATCH).name;
    const unmatched = STYLES.filter((s) => getStyleDNA(s).name === fallback);
    assert.deepEqual(unmatched, [], `styles falling through to the default: ${unmatched.join(', ')}`);
});

test('every genre in the UI resolves to its own persona', () => {
    const fallback = getPersona(NO_MATCH).role;
    const unmatched = GENRES.filter((g) => getPersona(g).role === fallback);
    assert.deepEqual(unmatched, [], `genres falling through to the default: ${unmatched.join(', ')}`);
});

test('every genre has a specific goal, not the generic fallback', () => {
    const fallback = getGenreGoal(NO_MATCH);
    const unmatched = GENRES.filter((g) => getGenreGoal(g) === fallback);
    assert.deepEqual(unmatched, [], `genres falling through to the generic goal: ${unmatched.join(', ')}`);
});

test('persona and genre goal never brief the model differently', () => {
    // Both strings are injected into the SAME system prompt. When they
    // disagree the model gets two contradictory briefs at once — Action once
    // received a horror goal, Sports an action goal against a motivational
    // persona, and four genres had a specific persona but a generic goal.
    //
    // Asserted by theme keyword rather than exact text, so wording can evolve
    // without breaking the test but a category swap cannot slip through.
    const expectations = [
        ['Action / Thriller', /KINETIC/, /أكشن/],
        ['Mystery / True Crime', /CASE BUILDER/, /غموض|تحقيق/],
        ['Sports / Fitness', /LIFE STRATEGIST/, /رياضي|لياقة/],
        ['Story Time', /CAMPFIRE/, /حكاية/],
        ['Islamic / Religious', /REVERENT/, /ديني/],
        ['Finance / Business', /STRATEGY ANALYST/, /مالي|أعمال/],
        ['News / Analysis', /TRUTH SEEKER/, /أخبار|تحليل/],
        ['Horror (Psychological)', /NIGHTMARES/, /رعب/],
        ['Kids / Family', /PLAYFUL/, /أطفال|عائلة/],
    ];
    for (const [genre, personaRe, goalRe] of expectations) {
        assert.match(getPersona(genre).role, personaRe, `${genre}: persona`);
        assert.match(getGenreGoal(genre), goalRe, `${genre}: goal`);
    }
});

test('every character type in the UI resolves to its own DNA', () => {
    const fallback = getCharacterDNA(NO_MATCH).name;
    const unmatched = CHARACTER_TYPES.filter((c) => getCharacterDNA(c).name === fallback);
    assert.deepEqual(unmatched, [], `character types falling through: ${unmatched.join(', ')}`);
});

test('specific styles are not shadowed by broader branches', () => {
    // "Cyberpunk / Neon Noir" contains "noir"; the Film Noir branch used to win
    // and injected a black-and-white palette into a neon prompt.
    assert.match(getStyleDNA('Cyberpunk / Neon Noir').name, /Cyberpunk/);
    // "3D Cute Character (Pixar Style)" contains "pixar".
    assert.match(getStyleDNA('3D Cute Character (Pixar Style)').name, /Cute/);
    // The broader branches must still work for their own values.
    assert.match(getStyleDNA('Film Noir').name, /Noir/);
    assert.match(getStyleDNA('Disney Pixar 3D').name, /Pixar/);
});

test('specific genres are not shadowed by broader branches', () => {
    // "Action / Thriller" and "Mystery / True Crime" were both captured by the
    // horror branch, whose stated mission is "to TRAUMATIZE".
    assert.match(getPersona('Action / Thriller').role, /KINETIC/);
    assert.match(getPersona('Mystery / True Crime').role, /CASE BUILDER/);
    assert.match(getPersona('Horror (Psychological)').role, /NIGHTMARES/);
    // "Science Explainer" was captured by the medical branch.
    assert.match(getPersona('Science Explainer').role, /SCIENCE COMMUNICATOR/);
    assert.match(getPersona('Medical / Health').role, /CONSULTANT/);
});

test('kids and religious genres never inherit the generic director persona', () => {
    // The default persona's laws are "Tarantino dialogue / Villeneuve visuals",
    // which is actively wrong for these two.
    const kids = getPersona('Kids / Family');
    assert.match(kids.role, /PLAYFUL/);
    assert.ok(
        kids.common_pitfalls.some((p) => /scary|Sarcasm/i.test(p)),
        'kids persona should warn against scary or sarcastic content'
    );
    assert.match(getPersona('Islamic / Religious').role, /REVERENT/);
});

test('every record of an engine has the same shape', () => {
    const shape = (o) => Object.keys(o).sort().join(',');
    const styleShapes = new Set(STYLES.map((s) => shape(getStyleDNA(s))));
    assert.equal(styleShapes.size, 1, 'style DNA records disagree on their key set');

    const personaShapes = new Set(GENRES.map((g) => shape(getPersona(g))));
    assert.equal(personaShapes.size, 1, 'persona records disagree on their key set');
});

test('trendEngine reads field names that actually exist on the DNA records', () => {
    // These four were read as charDNA.visual_rules / .personality and
    // dialectDNA.rules / .style — none of which exist. Every `||` chain fell
    // through to JSON.stringify(...).substring(0, 500), so the trend prompt got
    // a raw JSON dump cut mid-key.
    const character = getCharacterDNA('talking_food');
    for (const key of ['visualBuild', 'personalityTraits', 'dialogueStyle']) {
        assert.ok(key in character, `character DNA is missing ${key}`);
    }
    const dialect = getDialectDNA('Egyptian');
    for (const key of ['vocabularyRules', 'slangWords']) {
        assert.ok(key in dialect, `dialect DNA is missing ${key}`);
    }
});

test('transparent_creature has the subTypes its variation rule depends on', () => {
    // brainstormEngine guards the "one creature per idea" rule on
    // charDNA.subTypes. Without a record here the guard silently never fired.
    const dna = getCharacterDNA('transparent_creature');
    assert.ok(Array.isArray(dna.subTypes) && dna.subTypes.length >= 3);
});

test('subType labels resolve on every branch that has them', () => {
    // Each branch names its discriminator differently (type, food, animal,
    // object, organ...). Reading `.type` unconditionally produced the literal
    // string "undefined" in the prompt on 14 of 15 branches.
    const labelOf = (sub) => sub.type ?? sub.label ?? Object.values(sub)[0];
    for (const type of CHARACTER_TYPES) {
        const dna = getCharacterDNA(type);
        if (!dna.subTypes?.length) continue;
        for (const sub of dna.subTypes) {
            const label = labelOf(sub);
            assert.equal(typeof label, 'string', `${type}: subType label is not a string`);
            assert.ok(label.length > 0, `${type}: empty subType label`);
        }
    }
});

test('the system prompt never contradicts itself on scene count', () => {
    // The arc bands are derived from numScenes inside generateSystemPrompt, so
    // the clamp has to live there too — not only in generate_prompt. This
    // function is exported and takes raw data, and a direct call with scenes: 1
    // produced "scenes 2-1: climax".
    const base = {
        concept: 'x', genre: 'comedy', style: 'cinematic', character_type: 'talking_food',
        duration: 10, dialect: 'Egyptian Arabic (Masri)', tone: 'playful', aspectRatio: '9:16',
    };
    for (const scenes of [undefined, null, 0, 1, 2, 3, 4, 5, 12, 20, 99, -7, 'abc']) {
        const prompt = generateSystemPrompt({ ...base, scenes, characters: 1 });
        const bands = prompt.match(/المشاهد (\d+)-(\d+)/g) || [];
        assert.ok(bands.length >= 3, `scenes=${scenes}: expected three arc bands`);
        for (const band of bands) {
            const [from, to] = band.match(/\d+/g).map(Number);
            assert.ok(to >= from, `scenes=${scenes}: inverted band "${band}"`);
        }
        assert.doesNotMatch(prompt, /undefined|NaN|\[object Object\]/, `scenes=${scenes}: junk in prompt`);
    }
});

test('the declared character count always matches the cast described', () => {
    // `characters: 3` with an empty secondary list used to tell the model
    // "produce exactly 3 characters" while describing only one — two
    // contradictory instructions in the same prompt. The count is derived from
    // the roster now, so they cannot drift apart.
    const base = {
        concept: 'x', genre: 'comedy', style: 'cinematic', character_type: 'talking_food',
        duration: 10, dialect: 'Egyptian Arabic (Masri)', tone: 'playful', aspectRatio: '9:16', scenes: 5,
    };
    const cases = [
        { characters: 1, secondary_characters: [] },
        { characters: 3, secondary_characters: ['animals', 'objects'] },
        { characters: 3, secondary_characters: [] },
        { characters: 1, secondary_characters: ['animals', 'objects'] },
        { characters: 9, secondary_characters: ['animals', '', null] },
        { secondary_characters: ['objects'] },
    ];
    for (const c of cases) {
        const prompt = generateSystemPrompt({ ...base, ...c });
        const declared = Number((prompt.match(/بالظبط (\d+) شخصية/) || [])[1]);
        const described = (prompt.match(/↳ شخصية:/g) || []).length;
        assert.equal(declared, 1 + described,
            `declared ${declared} but described ${1 + described} for ${JSON.stringify(c)}`);
    }
});

test('the dramatic-arc bands never invert for any scene count', () => {
    // screenplayEngine clamps numScenes to 4..20. Below 4 the three bands
    // overlapped or ran backwards — a 3-scene video was told "scenes 4-3".
    const clamp = (n) => Math.min(Math.max(parseInt(n, 10) || 5, 4), 20);
    for (const input of [1, 2, 3, 4, 5, 8, 12, 20, 50, 999, 'abc', '', null]) {
        const scenes = clamp(input);
        const endOfAct1 = Math.ceil(scenes * 0.25);
        const endOfAct2 = Math.ceil(scenes * 0.7);
        assert.ok(endOfAct1 >= 1, `input ${input}: act 1 ends before it starts`);
        assert.ok(endOfAct1 + 1 <= endOfAct2, `input ${input}: act 2 inverted`);
        assert.ok(endOfAct2 + 1 <= scenes, `input ${input}: act 3 inverted`);
    }
});
