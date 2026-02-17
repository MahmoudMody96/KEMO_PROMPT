// src/api/config.js - API Configuration
// DUAL MODE: Backend Proxy (production) or Direct API (development)

// Backend proxy URL — when running the backend server
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

// Direct API key — ONLY used in development when backend is not running
const DIRECT_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

// Detect mode: Use backend proxy if available, fallback to direct API
export const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true' || !DIRECT_API_KEY;

// Export configuration based on mode
export const API_KEY = DIRECT_API_KEY;
export const API_URL = USE_BACKEND
    ? `${BACKEND_URL}/api/generate`
    : 'https://openrouter.ai/api/v1/chat/completions';

export const VISION_URL = USE_BACKEND
    ? `${BACKEND_URL}/api/vision`
    : 'https://openrouter.ai/api/v1/chat/completions';

export const BACKEND_API_URL = BACKEND_URL;

// Models
export const TEXT_MODEL = 'google/gemini-2.0-flash-001';
export const VISION_MODEL = 'google/gemini-2.0-flash-001';

// Validate configuration on load
if (USE_BACKEND) {
    console.log('🔒 Running in BACKEND PROXY mode — API key is protected');
    console.log(`   Backend: ${BACKEND_URL}`);
} else if (!API_KEY) {
    console.error('❌ No API configuration found!');
    console.error('📝 Either:');
    console.error('   Option A: Start the backend server (cd server && npm run dev)');
    console.error('   Option B: Add VITE_OPENROUTER_API_KEY to .env (development only)');
} else {
    console.warn('⚠️ Running in DIRECT API mode — API key exposed in browser!');
    console.warn('   Switch to backend proxy before deploying to production.');
}

// Helper to check if API is configured
export function isAPIConfigured() {
    if (USE_BACKEND) return true;
    return !!API_KEY && API_KEY !== 'your_api_key_here';
}
