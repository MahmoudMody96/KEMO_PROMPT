// ═══════════════════════════════════════════════════════════════════
// EXTRACTOR ENGINE — Image & Video forensic analysis
// ═══════════════════════════════════════════════════════════════════

import { VISION_MODEL } from '../config.js';
import { callOpenRouterVision, callGeminiMultiImage, toBase64 } from '../openrouter.js';
import { extractFramesInterval } from '../utils/frameExtractor.js';


// --- FORENSIC IMAGE ANALYZER WITH METADATA ---

export async function analyze_image(file) {
    try {
        const base64Data = await toBase64(file);
        const pureBase64 = base64Data.split(',')[1];
        const mimeType = base64Data.split(';')[0].split(':')[1];

        const prompt = `You are an expert CGI Artist, Cinematographer, and Technical Director.
Analyze this image for PIXEL-PERFECT replication.

FORENSIC ANALYSIS - Technical Specs:
1. Composition: Frame type, angle, visual hierarchy
2. Lighting: Type, direction, quality
3. Camera/Lens: Aperture, effects, film stock
4. Colors: Palette, grading, temperature
5. Texture/Material: Surface details
6. Style/Engine: Render engine, art style

METADATA EXTRACTION - Map to these options:
- Styles: [Cinematic, 3D Cute Character (Pixar Style), Anime, Cyberpunk, Claymation, Minimalist, Disney Pixar 3D, Realistic, Studio Ghibli, Soft 3D / C4D Render]
- Genres: [Tutorial, Medical, Science, Documentary, Psychology, Comedy, Drama, Horror, Sci-Fi, Fantasy, Action, Romance, Mystery, Viral, Story Time, Commercial, Cooking, Motivational, Kids, Sports, Islamic, Finance, News]
- Aspect Ratios: [16:9, 9:16, 1:1, 4:5]

Return ONLY valid JSON:
{
  "visual_elements": {
    "subject": "Precise main subject description...",
    "style": "Exact art style identified...",
    "lighting": "Detailed lighting setup...",
    "camera": "Lens, aperture, film stock...",
    "colors": "Color palette and grading...",
    "composition": "Frame type and angle..."
  },
  "universal_prompt": "Dense, comma-separated prompt: [Subject], [Action], [Environment], [Lighting], [Camera], [Style], [Quality: 8k, ultra-detailed].",
  "meta_data": {
    "recommended_style": "Exact match from Styles list",
    "recommended_genre": "Exact match from Genres list",
    "detected_aspect_ratio": "16:9, 9:16, 1:1, or 4:5",
    "estimated_character_count": 1,
    "estimated_scene_count": 1
  }
}`;

        return await callOpenRouterVision(prompt, pureBase64, mimeType);
    } catch (e) {
        console.error(`Image Error: ${e.message}`);
        return null;
    }
}

// --- FORENSIC VIDEO ANALYZER WITH METADATA ---

export async function analyze_video(input, onProgress = null) {
    if (input instanceof File) {
        try {
            if (onProgress) onProgress('Extracting frames...');
            const frames = await extractFramesInterval(input, 3, onProgress);
            if (frames.length === 0) throw new Error("Could not extract frames.");
            if (onProgress) onProgress(`Analyzing ${frames.length} frames...`);

            const imageContents = frames.map(base64 => ({
                type: 'image_url',
                image_url: { url: base64 }
            }));

            const prompt = `You are a Cinematographer and VFX Supervisor reverse-engineering this video.
Frames captured every 3 seconds from start to end.
Goal: Write a prompt to recreate this video IDENTICALLY.

FORENSIC DEEP ANALYSIS:
1. Motion Signature: Camera movement type, subject motion, speed
2. Temporal Consistency: Lighting/weather evolution
3. Visual Fidelity: Film stock, render style
4. Atmosphere: Particles, fog, lens FX
5. Pacing: Cut rhythm, transitions

METADATA EXTRACTION - Map to these options:
- Styles: [Cinematic, 3D Cute Character (Pixar Style), Anime, Cyberpunk, Claymation, Minimalist, Disney Pixar 3D, Realistic, Soft 3D / C4D Render, GoPro POV]
- Genres: [Tutorial, Medical, Science, Documentary, Psychology, Comedy, Drama, Horror, Sci-Fi, Fantasy, Action, Romance, Mystery, Viral, Story Time, Commercial, Cooking, Motivational, Kids, Sports, Islamic, Finance, News]
- Aspect Ratios: [16:9, 9:16, 1:1, 4:5]

Return ONLY valid JSON:
{
  "visual_style": "Detailed aesthetic description...",
  "motion_description": "Precise camera and subject movement...",
  "scene_progression": "What happens from start to end...",
  "universal_prompt": "Dense video prompt with motion commands, environment, lighting, style, quality tags.",
  "meta_data": {
    "recommended_style": "Exact match from Styles list",
    "recommended_genre": "Exact match from Genres list",
    "detected_aspect_ratio": "16:9, 9:16, 1:1, or 4:5 (based on video dimensions)",
    "estimated_character_count": 1,
    "estimated_scene_count": 3
  }
}`;

            return await callGeminiMultiImage(prompt, imageContents);
        } catch (e) {
            console.error("Video Analysis Error:", e);
            throw new Error(`Processing failed: ${e.message}`);
        }
    } else if (typeof input === 'string') {
        return {
            error: true,
            message: "External URLs cannot be analyzed. Please upload the video file directly.",
            suggestion: "Download the video and upload it using the file picker."
        };
    }
}
