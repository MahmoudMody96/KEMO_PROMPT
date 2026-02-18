// src/api/promptApi.js — FACADE
// All logic has been extracted into engines/*.js
// This file re-exports public API for backward compatibility.
// Consumers: import { generate_prompt, brainstorm_concept, ... } from './promptApi'

// Screenplay generation
export { generate_prompt, regenerate_scene } from './engines/screenplayEngine.js';

// Brainstorming
export { brainstorm_concept } from './engines/brainstormEngine.js';

// Trend hunting
export { search_viral_trends, generate_from_trend } from './engines/trendEngine.js';

// Prompt architect (NEXUS)
export { engineer_universal_prompt, refine_prompt, simulate_prompt } from './engines/nexusEngine.js';

// Image / Video extraction
export { analyze_image, analyze_video } from './engines/extractorEngine.js';

// DNA Engines (backward compat re-export)
export { getPersona } from './engines/personaEngine.js';
