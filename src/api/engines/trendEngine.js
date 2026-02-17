// TREND ENGINE - search_viral_trends + generate_from_trend
import { TEXT_MODEL } from '../config.js';
import { callOpenRouter } from '../openrouter.js';
import { getCharacterDNA } from './characterDnaEngine.js';
import { getDialectDNA } from './dialectDnaEngine.js';
import { getGenreDNA, getHookTemplates } from './brainstormEngine.js';

// --- VIRAL TREND SEARCH ENGINE v2.0 ---

const PLATFORM_RULES = {
    general: {
        name: 'All Platforms',
        rules: 'Optimize for cross-platform virality. Mix formats that work on TikTok, YouTube Shorts, AND Reels.',
        specs: 'Duration: 15-60s | Aspect: 9:16 | Style: Universal hooks'
    },
    tiktok: {
        name: 'TikTok',
        rules: `TikTok Algorithm Priorities:
- Watch time % is KING (not just views)
- First 1-2 seconds decide everything (scroll-stop hook)
- Sounds/music trends drive discovery (use trending audio)
- Stitch/Duet bait increases reach 3x
- Text overlays + fast cuts = higher retention
- Loop content gets 2-5x more plays`,
        specs: 'Duration: 7-30s optimal | Aspect: 9:16 | Sound: ON (critical)'
    },
    shorts: {
        name: 'YouTube Shorts',
        rules: `YouTube Shorts Algorithm Priorities:
- First 3 seconds = thumbnail equivalent (NO skip intro)
- Educational/Informational content outperforms by 40%
- Faceless content performs well (unlike TikTok)
- Subscribe CTA in last 2 seconds boosts channel growth
- Longer Shorts (30-58s) get MORE impressions
- YouTube favors original content over reposts`,
        specs: 'Duration: 30-58s optimal | Aspect: 9:16 | Sound: ON but less critical'
    },
    reels: {
        name: 'Instagram Reels',
        rules: `Instagram Reels Algorithm Priorities:
- Aesthetic quality matters MORE than other platforms
- Carousel-style Reels (multiple ideas) get saved more
- Instagram pushes Reels with AR filters and effects
- Share-to-DM is the #1 ranking signal
- Relatable/lifestyle content > raw information
- Caption hooks drive comments (engagement signal)`,
        specs: 'Duration: 15-30s optimal | Aspect: 9:16 | Sound: Mixed (many watch muted)'
    }
};

const REGION_RULES = {
    global: {
        name: 'Global',
        context: 'Analyze worldwide viral trends. Focus on universally appealing content that crosses cultural boundaries.',
    },
    egypt: {
        name: 'Egypt (مصر)',
        context: `Egyptian audience context:
- Egyptian Arabic (Masri) is the dominant dialect
- Comedy, sarcasm, and relatability dominate
- Meme culture is massive - reference local memes
- Popular niches: comedy sketches, food, tech reviews, educational
- Key platforms: TikTok dominates, YouTube Shorts growing fast
- Peak hours: 8PM-1AM Cairo time
- Music: Mahraganat, Shaabi, trending Arabic songs`,
    },
    saudi: {
        name: 'Saudi Arabia (السعودية)',
        context: `Saudi audience context:
- Gulf Arabic (Khaleeji) dialect preferred
- High purchasing power - premium/luxury content performs well
- Car culture, food reviews, lifestyle content trend heavily
- Snap is massive but TikTok/Shorts growing fast
- Vision 2030 topics (entertainment, tourism, tech) trend
- Peak hours: 9PM-2AM Riyadh time
- More conservative but rapidly modernizing content tastes`,
    },
    uae: {
        name: 'UAE (الإمارات)',
        context: `UAE audience context:
- Multicultural audience (Arabic + English + South Asian)
- Luxury, lifestyle, business, and tech content dominates
- Dubai/Abu Dhabi lifestyle is a genre on its own
- High engagement with polished, premium content
- Bilingual content (Arabic/English) performs well
- Influencer culture is very strong
- Peak hours: 8PM-12AM Gulf time`,
    },
    usa: {
        name: 'United States',
        context: `US audience context:
- English language content
- Trend-setting market for global virality
- Pop culture references, challenges, and memes spread fast
- Diversity in content - niche communities thrive
- Algorithm favors high watch time and shares
- TikTok Shop integration drives commerce content
- Peak hours: 6PM-11PM across time zones`,
    },
    uk: {
        name: 'United Kingdom',
        context: `UK audience context:
- British English with cultural specificity
- Dry humor and wit perform exceptionally well
- Football, music, and lifestyle content trend
- Smaller market but high engagement rates
- British slang and references boost relatability
- Cross-pollination with US trends but with local twist
- Peak hours: 7PM-11PM GMT`,
    },
    morocco: {
        name: 'Morocco (المغرب)',
        context: `Moroccan audience context:
- Darija (Moroccan Arabic) is the primary dialect
- French-Arabic mix (Franco-Arabe) is common
- Food culture (tagine, couscous, street food) trends heavily
- Fashion, beauty, and traditional culture content performs well
- Growing TikTok community - one of the fastest in Africa
- Bilingual content (Darija/French) reaches wider audience
- Peak hours: 9PM-1AM Morocco time`,
    }
};

export async function search_viral_trends(topic, language = 'en', platform = 'general', region = 'global') {
    const langName = language === 'ar' ? 'Arabic' : 'English';
    const langInstruction = `\n*** 🌐 LANGUAGE ***\nAll text fields (title, viral_reason, structure_name, example_hook, retention_tricks, audio_style, visual_style) MUST be written in ${langName}.\n`;

    const platformData = PLATFORM_RULES[platform] || PLATFORM_RULES.general;
    const platformSection = `\n*** 📱 TARGET PLATFORM: ${platformData.name} ***\n${platformData.rules}\n📐 Specs: ${platformData.specs}\n\nTailor ALL trends specifically for ${platformData.name}. Each trend must include "best_platform" field.\n`;

    // Region context injection
    const regionData = REGION_RULES[region] || REGION_RULES.global;
    const regionSection = region !== 'global'
        ? `\n*** 📍 TARGET REGION: ${regionData.name} ***\n${regionData.context}\n\nAll trends MUST be tailored for ${regionData.name} audience. Consider local culture, dialect, humor style, and content preferences.\n`
        : `\n*** 📍 REGION: Global ***\nFocus on universally viral content that works across cultures and regions.\n`;

    // Get hook templates for inspiration
    const hookExamples = getHookTemplates('viral');
    const hookSection = hookExamples && hookExamples.length > 0
        ? `\n*** 🎣 HOOK INSPIRATION LIBRARY ***\nUse these proven hooks as INSPIRATION (adapt to niche, don't copy):\n${hookExamples.slice(0, 5).map((h, i) => `${i + 1}. "${h}"`).join('\n')}\n`
        : '';

    const systemPrompt = `You are the ALGORITHM behind ${platformData.name === 'All Platforms' ? 'TikTok, YouTube Shorts, and Instagram Reels' : platformData.name}.
You have access to millions of data points on audience retention, watch time, and engagement metrics.
${platformSection}${regionSection}
** User Niche:** "${topic}"

** Your Mission:**
Identify 3 DISTINCT Viral Formats currently DOMINATING this niche on ${platformData.name}.
For each format, you must 'DECODE THE DNA' - the psychological triggers and visual structures.

*** 🧠 DEEP ANALYSIS CRITERIA ***
For each viral format, analyze:
• PSYCHOLOGY: WHY does this hook the brain? (Fear, Curiosity, FOMO, ASMR, Satisfaction)
• RETENTION: What keeps viewers watching? (Open loops, Anticipation, Pattern interrupts)
• STRUCTURE: What's the second-by-second breakdown?
• AUDIO: What sounds trigger emotional response?
${hookSection}
*** 📊 OUTPUT FORMAT (Strict JSON Array) ***
[
    {
        "id": 1,
        "title": "The 'Negative Bias' Hook",
        "viral_score": 98,
        "viral_reason": "Uses fear of making a mistake to grab attention immediately. Triggers loss aversion bias.",
        "structure_name": "Stop Doing This 🛑",
        "visual_style": "0-3s: Red filter, chaotic movement, warning icon overlay. 3-10s: Calm explanation with clean b-roll. 10-15s: The reveal/solution.",
        "audio_style": "Alarm SFX start → Dramatic pause → Smooth Lo-Fi beat → Satisfying 'ding' on solution",
        "example_hook": "If you are still [doing X], you need to watch this...",
        "retention_tricks": ["Open loop in first 2 seconds", "Visual pattern interrupt at second 5", "Cliffhanger before solution"],
        "best_platform": "TikTok"
    }
]

*** 🎯 REQUIREMENTS ***
- Be HIGHLY SPECIFIC to the niche "${topic}"
- Each style must be DISTINCTLY DIFFERENT from the others
- Focus on what's working NOW (2024-2025 trends)
- Include ACTIONABLE visual and audio descriptions
- viral_score must be between 70-100 based on real trend performance
- viral_reason must explain the BRAIN SCIENCE behind why it works
- structure_name should be catchy with an emoji
- visual_style should be second-by-second breakdown
- retention_tricks should be specific techniques used
- best_platform: which platform this format works BEST on
${langInstruction}
ANALYZE NOW for topic: "${topic}" on ${platformData.name}`;

    return callOpenRouter(systemPrompt, TEXT_MODEL, false);
}

// --- TREND-BASED BLUEPRINT GENERATOR ---

export async function generate_from_trend(selectedTrend, topic, numScenes = 5, durationSeconds = 10, language = 'en', dnaOptions = {}) {
    const maxWordsPerScene = Math.floor(durationSeconds * 2.5);
    const langName = language === 'ar' ? 'Arabic' : 'English';
    const langInstruction = language === 'ar'
        ? `\n*** 🌐 LANGUAGE ***\n- title, hook_line, dialogue_script: MUST be in Arabic\n- visual_script, audio_notes, universal_prompt: MUST be in English (for AI image/video generation)\n- character names: provide both name_ar and name_en\n`
        : `\n*** 🌐 LANGUAGE ***\n- All text fields MUST be in English\n- character names: provide both name_ar and name_en\n`;

    // Build DNA injection from user selections
    let dnaSection = '';
    if (dnaOptions.genre) {
        const genreDNA = getGenreDNA(dnaOptions.genre);
        if (genreDNA) {
            dnaSection += `\n*** 🎭 GENRE DNA: ${dnaOptions.genre.toUpperCase()} ***\n${typeof genreDNA === 'string' ? genreDNA : JSON.stringify(genreDNA, null, 2)}\nApply this genre's tone, pacing, and storytelling rules.\n`;
        }
    }
    if (dnaOptions.character) {
        const charDNA = getCharacterDNA(dnaOptions.character);
        if (charDNA) {
            const charSummary = typeof charDNA === 'string' ? charDNA : (charDNA.visual_rules || charDNA.personality || JSON.stringify(charDNA).substring(0, 500));
            dnaSection += `\n*** 🎬 CHARACTER DNA: ${dnaOptions.character} ***\n${charSummary}\nUse this character type as the main character.\n`;
        }
    }
    if (dnaOptions.dialect) {
        const dialectDNA = getDialectDNA(dnaOptions.dialect);
        if (dialectDNA) {
            const dialectSummary = typeof dialectDNA === 'string' ? dialectDNA : (dialectDNA.rules || dialectDNA.style || JSON.stringify(dialectDNA).substring(0, 500));
            dnaSection += `\n*** 🗣️ DIALECT DNA: ${dnaOptions.dialect} ***\n${dialectSummary}\nAll dialogue MUST be in this dialect.\n`;
        }
    }

    const systemPrompt = `You are a VIRAL CONTENT CREATOR and ELITE SCREENWRITER.
You specialize in creating high-retention video content using proven viral formulas.

*** SELECTED TREND STYLE ***
Title: ${selectedTrend.title}
Why It's Viral: ${selectedTrend.viral_reason}
Visual Style: ${selectedTrend.visual_style}
Audio Style: ${selectedTrend.audio_style || 'Match to visual energy'}
Example Hook: ${selectedTrend.example_hook}
${dnaSection}
*** YOUR TASK ***
Create a FULL VIDEO BLUEPRINT applying the "${selectedTrend.title}" format to the topic: "${topic}"

*** MANDATORY PROTOCOLS ***

📽️ MAXIMALIST VISUAL DESCRIPTIONS (40-60 words per scene):
Every visual_script MUST include:
- [LOCATION: Detailed environment description]
- [LIGHTING: Light source, color temperature, shadows]
- [CAMERA: Angle, lens, movement]
- [ACTION: Character actions with texture/atmosphere details]
- Quality tags: 8k, cinematic, Unreal Engine 5, etc.

🔊 SPATIAL AUDIO LAYERING:
Every audio_notes MUST include:
- FG (Foreground): Character sounds, dialogue
- MG (Mid-ground): Environment sounds
- BG (Background): Atmosphere, music

🎭 APPLY THE TREND STYLE:
- Use the hook style from the selected trend
- Match the visual treatment (fast cuts, text overlays, etc.)
- Maintain the tone throughout all scenes

*** OUTPUT FORMAT ***
Return ONLY valid JSON:
{
    "trend_applied": "${selectedTrend.title}",
    "title": "Catchy video title",
    "hook_line": "The opening hook line based on the trend style",
    "characters": [
        {
            "name_ar": "الاسم",
            "name_en": "Name",
            "description": "Detailed character description with species-appropriate traits, wardrobe, and quality tags."
        }
    ],
    "scenes": [
        {
            "scene_number": 1,
            "duration": "${durationSeconds}s",
            "shot_type": "ECU / CU / MS / WS",
            "visual_script": "[LOCATION: ...] [LIGHTING: ...] [CAMERA: ...] [ACTION: ...] (40-60 words with quality tags)",
            "dialogue_script": "(Tone: emotion) 'Full conversational dialogue...' [SFX: sound]",
            "audio_notes": "FG: ... | MG: ... | BG: ... Music: ...",
            "universal_prompt": "Dense comma-separated image generation prompt"
        }
    ]
}
${langInstruction}
*** VIDEO SPECS ***
- Topic: ${topic}
- Scenes: ${numScenes}
- Duration per scene: ${durationSeconds}s (MAX ${maxWordsPerScene} words dialogue)
- Style: Apply "${selectedTrend.title}" throughout

GENERATE THE VIRAL BLUEPRINT NOW!`;

    return callOpenRouter(systemPrompt, TEXT_MODEL, false);
}