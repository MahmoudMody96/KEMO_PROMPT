// src/api/engines/consistencyLock.js — Consistency by construction.
//
// The screenplay system prompt carries a "CHARACTER LOCK PROTOCOL" telling the
// model to repeat each character's canonical description verbatim in every
// scene_prompt. That is an instruction, and instructions are complied with
// probabilistically: the model drifts on long scene counts, paraphrases the
// costume, or drops the CREF prefix entirely — and nothing downstream noticed.
//
// This module makes the guarantee structural instead. It runs on the parsed
// model output and REWRITES each scene_prompt so it begins with a CREF built
// from the character's own image_prompt. Whatever the model wrote for the
// reference is replaced by the canonical text; the scene's creative content is
// left untouched.
//
// The invariant: for any scene S mentioning character C, the descriptor of C in
// S is byte-identical to C's canonical descriptor. That holds regardless of
// what the model produced.

// A canonical descriptor is the stable, physical part of a character. Style and
// render keywords are deliberately excluded — repeating "--ar 16:9, octane
// render" inside every CREF wastes the image model's attention budget on
// instructions the scene_prompt already carries at the end.
const RENDER_NOISE = /\s*(--\w+\s+\S+|\b(?:8k|4k|uhd|hdr|octane render|unreal engine|cinematic lighting|photorealistic|hyperrealistic|highly detailed|masterpiece|best quality)\b,?)/gi;

const MAX_DESCRIPTOR_WORDS = 40;

export function canonicalDescriptor(character) {
    if (!character) return '';
    // image_prompt is the character sheet the reference image is generated from,
    // so it is the one description the visuals are actually anchored to.
    // screenplay_description is the structured fallback.
    const raw = String(character.image_prompt || character.screenplay_description || '').trim();
    if (!raw) return '';

    return raw
        .replace(RENDER_NOISE, ' ')
        .replace(/\s+/g, ' ')
        .replace(/^[,\s]+|[,\s]+$/g, '')
        .split(/\s+/)
        .slice(0, MAX_DESCRIPTOR_WORDS)
        .join(' ');
}

export function characterName(character) {
    return String(character?.name_en || character?.name_ar || '').trim() || 'Character';
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Which characters appear in a scene.
 *
 * Falls back to the primary character rather than an empty list: a scene with
 * no detectable name is far more likely to be an unnamed shot of the lead than
 * a scene with no characters, and anchoring it is the safer error.
 */
export function charactersInScene(scene, characters) {
    const haystack = [
        scene?.visual_script, scene?.scene_prompt, scene?.dialogue_script,
    ].filter(Boolean).join(' ').toLowerCase();

    const present = characters.filter((c) => {
        const names = [c.name_en, c.name_ar].filter(Boolean).map((n) => String(n).toLowerCase());
        return names.some((n) => n.length > 1 && haystack.includes(n));
    });

    return present.length ? present : characters.slice(0, 1);
}

/**
 * Rewrite every scene_prompt so its CREF is generated, not trusted.
 *
 * Returns the corrected screenplay plus a report of what was changed, so the UI
 * can show that enforcement happened rather than claiming it silently.
 */
export function enforceConsistency(screenplay) {
    const characters = Array.isArray(screenplay?.characters) ? screenplay.characters : [];
    const scenes = Array.isArray(screenplay?.scenes) ? screenplay.scenes : [];

    if (!characters.length || !scenes.length) {
        return { screenplay, report: { enforced: 0, scenesChanged: [], skipped: 'no characters or scenes' } };
    }

    const descriptors = new Map();
    for (const c of characters) {
        const d = canonicalDescriptor(c);
        if (d) descriptors.set(c, d);
    }
    if (!descriptors.size) {
        return { screenplay, report: { enforced: 0, scenesChanged: [], skipped: 'no usable character descriptions' } };
    }

    const scenesChanged = [];

    const nextScenes = scenes.map((scene, i) => {
        const present = charactersInScene(scene, characters).filter((c) => descriptors.has(c));
        if (!present.length) return scene;

        const cref = present
            .map((c) => `CREF: ${characterName(c)} - ${descriptors.get(c)}`)
            .join(' | ');

        const original = String(scene.scene_prompt || '').trim();

        // Strip whatever CREF block the model wrote, up to the first separator
        // that starts the scene's own content. Without this, re-running would
        // stack a second CREF onto the first.
        let body = original.replace(/^\s*(CREF\s*:[^.|]*(\|[^.|]*)*)[.|]?\s*/i, '').trim();

        // A scene_prompt that was ONLY a CREF leaves no body; keep the original
        // rather than emitting a prompt with no scene in it.
        if (!body) body = original;

        const rebuilt = `${cref}. ${body}`;

        if (rebuilt !== original) {
            scenesChanged.push({
                scene: scene.scene_number ?? i + 1,
                characters: present.map(characterName),
                had: original.slice(0, 60),
            });
        }

        return { ...scene, scene_prompt: rebuilt };
    });

    return {
        screenplay: { ...screenplay, scenes: nextScenes },
        report: {
            enforced: scenesChanged.length,
            totalScenes: scenes.length,
            scenesChanged,
        },
    };
}

/**
 * Read-only check used by tests and by the UI's audit view.
 * Reports scenes whose CREF does not match the canonical descriptor.
 */
export function auditConsistency(screenplay) {
    const characters = Array.isArray(screenplay?.characters) ? screenplay.characters : [];
    const scenes = Array.isArray(screenplay?.scenes) ? screenplay.scenes : [];
    const drift = [];

    for (const [i, scene] of scenes.entries()) {
        const present = charactersInScene(scene, characters);
        const prompt = String(scene.scene_prompt || '');
        for (const c of present) {
            const d = canonicalDescriptor(c);
            if (!d) continue;
            const expected = `CREF: ${characterName(c)} - ${d}`;
            if (!new RegExp(escapeRe(expected), 'i').test(prompt)) {
                drift.push({ scene: scene.scene_number ?? i + 1, character: characterName(c) });
            }
        }
    }

    return { consistent: drift.length === 0, drift };
}
