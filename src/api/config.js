// src/api/config.js — API configuration.
//
// The frontend and the API ship in the same container and are served from the
// same origin, so every call is a relative path. The old "direct API" mode is
// gone: it put the OpenRouter key in the browser, and there is no development
// convenience worth that.

export const API_URL = '/api/generate';
export const VISION_URL = '/api/vision';

// Models
export const TEXT_MODEL = 'google/gemini-2.0-flash-001';
export const VISION_MODEL = 'google/gemini-2.0-flash-001';
