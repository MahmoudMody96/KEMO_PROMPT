// ===========================
// QUALITY VALIDATION UTILITIES
// ===========================

/**
 * Score a scene_prompt based on quality criteria
 * Returns: {score, grade, feedback, issues}
 */
export const scoreScenePrompt = (prompt) => {
    if (!prompt || typeof prompt !== 'string') {
        return { score: 0, grade: 'F', feedback: 'Missing prompt', issues: ['No prompt provided'] };
    }

    let score = 0;
    const checks = {
        hasCREF: prompt.includes("CREF:") ? 20 : 0,
        hasLighting: /lighting|light|illumination|5000k|6500k/i.test(prompt) ? 15 : 0,
        hasCamera: /shot|lens|camera|angle|f\/|mm|anamorphic|imax|bokeh/i.test(prompt) ? 15 : 0,
        hasStyle: /unreal engine|pixar|octane|render|8k|12k|photorealistic|hyperrealistic/i.test(prompt) ? 15 : 0,
        wordCount: prompt.split(" ").length >= 60 ? 20 : (prompt.split(" ").length >= 40 ? 10 : 0),
        hasDetails: prompt.split(",").length >= 8 ? 15 : (prompt.split(",").length >= 5 ? 8 : 0)
    };

    score = Object.values(checks).reduce((a, b) => a + b, 0);

    const getGrade = (s) => {
        if (s >= 90) return "A+";
        if (s >= 80) return "A";
        if (s >= 70) return "B+";
        if (s >= 60) return "B";
        if (s >= 50) return "C";
        return "D";
    };

    const issues = [
        !checks.hasCREF && "Missing CREF token",
        !checks.hasLighting && "Missing lighting details",
        !checks.hasCamera && "Missing camera specs",
        !checks.hasStyle && "Missing style/rendering keywords",
        checks.wordCount < 20 && `Too short (${prompt.split(" ").length} words, expected 60+)`,
        checks.hasDetails < 15 && "Needs more details (< 8 elements)"
    ].filter(Boolean);

    return {
        score,
        grade: getGrade(score),
        feedback: score >= 80 ? "Excellent quality!" : score >= 60 ? "Good, minor improvements needed" : "Needs significant enhancement",
        issues
    };
};

/**
 * Validate consistency across all scenes
 * Returns: {valid, issues, stats}
 */
const promptOf = (scene) => scene?.image_prompts?.scene_prompt || scene?.scene_prompt || "";

/**
 * Audit scene prompts for character and style drift.
 *
 * @param {Array}  scenes
 * @param {Array} [characters] the generated character list, used as the
 *        reference. Falls back to scene 1 when absent.
 *
 * Reference choice matters: this used to measure every scene against scene 1,
 * so if scene 1 was itself wrong the whole set was reported "consistent" with a
 * bad baseline — and a drifted scene 1 was never flagged at all. The character
 * list is the actual source of truth, so drift is now measured against it and
 * scene 1 is audited like any other scene.
 */
export const validateConsistency = (scenes, characters) => {
    if (!Array.isArray(scenes) || scenes.length === 0) {
        return { valid: true, issues: [], stats: { total_scenes: 0, high_severity: 0, medium_severity: 0, low_severity: 0 } };
    }

    const issues = [];

    // Reference names come from the character list when we have one.
    const charNames = (Array.isArray(characters) ? characters : [])
        .map(c => (c?.name_en || c?.name_ar || '').trim())
        .filter(Boolean);

    const scene1Prompt = promptOf(scenes[0]);
    const crefMatch = scene1Prompt.match(/CREF:\s*([^-,]+)/);
    const fallbackCREF = crefMatch ? crefMatch[1].trim() : null;

    // Style keywords are read from what the prompts actually contain rather
    // than a fixed seven-item list, which covered only a fraction of the
    // styles the app offers and silently skipped the check for the rest.
    const styleSignature = (scene1Prompt.match(/--stylize \d+|--ar [\d:]+/g) || []).join(' ');

    scenes.forEach((scene, i) => {
        const currentPrompt = promptOf(scene);
        const sceneNo = i + 1;

        // Character presence — measured against the cast, not against scene 1.
        if (charNames.length > 0) {
            const mentionsAnyCharacter = charNames.some(n => currentPrompt.includes(n));
            const hasCref = /CREF:/i.test(currentPrompt);
            if (currentPrompt && !mentionsAnyCharacter && !hasCref) {
                issues.push({
                    scene: sceneNo,
                    type: "CREF_MISMATCH",
                    severity: "high",
                    message: `Scene ${sceneNo}: no character reference — expected one of ${charNames.join(', ')}`
                });
            }
        } else if (i > 0 && fallbackCREF && !currentPrompt.includes(fallbackCREF)) {
            issues.push({
                scene: sceneNo,
                type: "CREF_MISMATCH",
                severity: "high",
                message: `Scene ${sceneNo}: character description differs from scene 1 ("${fallbackCREF}" missing)`
            });
        }

        // Style/render parameter drift.
        if (i > 0 && styleSignature && currentPrompt) {
            const missing = styleSignature.split(' ').filter(tok => tok && !currentPrompt.includes(tok));
            if (missing.length) {
                issues.push({
                    scene: sceneNo,
                    type: "STYLE_CHANGE",
                    severity: "medium",
                    message: `Scene ${sceneNo}: render parameters differ (${missing.join(', ')} missing)`
                });
            }
        }

        // Missing is checked before length, and short-circuits it: an empty
        // string splits to one element, so the old order reported the same
        // scene as both "too short (1 words)" and "missing".
        if (!currentPrompt.trim()) {
            issues.push({
                scene: sceneNo,
                type: "MISSING_PROMPT",
                severity: "high",
                message: `Scene ${sceneNo}: scene_prompt is missing or empty`
            });
            return;
        }

        const wordCount = currentPrompt.trim().split(/\s+/).length;
        if (wordCount < 50) {
            issues.push({
                scene: sceneNo,
                type: "LENGTH_SHORT",
                severity: "low",
                message: `Scene ${sceneNo}: prompt is short (${wordCount} words, 60-80 recommended)`
            });
        }
    });

    return {
        valid: issues.length === 0,
        issues,
        stats: {
            total_scenes: scenes.length,
            high_severity: issues.filter(i => i.severity === "high").length,
            medium_severity: issues.filter(i => i.severity === "medium").length,
            low_severity: issues.filter(i => i.severity === "low").length
        }
    };
};
