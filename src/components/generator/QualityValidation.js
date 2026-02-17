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
export const validateConsistency = (scenes) => {
    if (!Array.isArray(scenes) || scenes.length === 0) {
        return { valid: true, issues: [], stats: { total_scenes: 0, high_severity: 0, medium_severity: 0, low_severity: 0 } };
    }

    const issues = [];

    // Get Scene 1 reference data
    const scene1Prompt = scenes[0]?.image_prompts?.scene_prompt || scenes[0]?.scene_prompt || "";

    // Extract CREF from Scene 1
    const crefMatch = scene1Prompt.match(/CREF:\s*([^-,]+)/);
    const scene1CREF = crefMatch ? crefMatch[1].trim() : null;

    // Extract style keywords
    const styleKeywords = ["Pixar", "Unreal Engine", "Octane", "Cinematic", "Anime", "Realistic", "3D Cute"];
    const scene1Style = styleKeywords.find(s => scene1Prompt.includes(s));

    // Check each scene for consistency
    scenes.forEach((scene, i) => {
        if (i === 0) return; // Skip Scene 1

        const currentPrompt = scene?.image_prompts?.scene_prompt || scene?.scene_prompt || "";

        // CREF consistency check
        if (scene1CREF && !currentPrompt.includes(scene1CREF)) {
            issues.push({
                scene: i + 1,
                type: "CREF_MISMATCH",
                severity: "high",
                message: `Scene ${i + 1}: Character description differs from Scene 1 ("${scene1CREF}" missing)`
            });
        }

        // Style consistency check
        if (scene1Style && !currentPrompt.includes(scene1Style)) {
            issues.push({
                scene: i + 1,
                type: "STYLE_CHANGE",
                severity: "medium",
                message: `Scene ${i + 1}: Style keyword "${scene1Style}" missing`
            });
        }

        // Word count check
        const wordCount = currentPrompt.split(" ").length;
        if (wordCount < 50) {
            issues.push({
                scene: i + 1,
                type: "LENGTH_SHORT",
                severity: "low",
                message: `Scene ${i + 1}: Prompt too short (${wordCount} words, expected 60-80)`
            });
        }

        // Empty prompt check
        if (!currentPrompt) {
            issues.push({
                scene: i + 1,
                type: "MISSING_PROMPT",
                severity: "high",
                message: `Scene ${i + 1}: scene_prompt is missing or empty`
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
