// src/api/config.js — API configuration.
//
// The frontend and the API ship in the same container and are served from the
// same origin, so every call is a relative path. The old "direct API" mode is
// gone: it put the OpenRouter key in the browser, and there is no development
// convenience worth that.

export const API_URL = '/api/generate';
export const VISION_URL = '/api/vision';

// NOTE: there are deliberately no model constants here any more.
//
// The server picks the model (OPENROUTER_MODEL in server/.env) and ignores any
// model the browser asks for unless it is explicitly allow-listed — credits are
// priced per action, not per model, so a client-chosen model would let anyone
// buy an expensive completion at a fixed price.
//
// Keeping a copy of the model name here meant two sources of truth that silently
// drifted apart. To change the model, change it in server/.env — one place.
