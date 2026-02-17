// ═══════════════════════════════════════════════════════════════════
// ENGINES BARREL — Re-exports all engines for clean imports
// Usage: import { getPersona, generate_prompt } from './engines'
// ═══════════════════════════════════════════════════════════════════

// --- DNA Engines (data providers) ---
export { getPersona } from './personaEngine.js';
export { getStyleDNA } from './styleDnaEngine.js';
export { getCharacterDNA } from './characterDnaEngine.js';
export { getVoiceToneDNA } from './voiceToneDnaEngine.js';
export { getDialectDNA } from './dialectDnaEngine.js';
export { getTransparentCreatureRules } from './transparentCreatureEngine.js';
export { getGenreGoal } from './genreGoalEngine.js';

// --- Feature Engines (business logic) ---
export { generate_prompt, generateSystemPrompt } from './screenplayEngine.js';
export { brainstorm_concept, generateIdeaPrompt, getGenreDNA, getHookTemplates } from './brainstormEngine.js';
export { search_viral_trends, generate_from_trend } from './trendEngine.js';
export { engineer_universal_prompt, refine_prompt, simulate_prompt } from './nexusEngine.js';
export { analyze_image, analyze_video } from './extractorEngine.js';
