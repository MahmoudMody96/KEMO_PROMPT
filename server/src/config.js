// server/src/config.js — Environment config, validated at boot.
//
// Anything missing that would make the server behave unsafely is a startup
// failure, not a runtime surprise. A container that refuses to start is a
// problem you find in the deploy log; one that starts half-configured is a
// problem you find in your billing.

import dotenv from 'dotenv';

dotenv.config();

function required(name) {
    const value = process.env[name];
    if (!value) {
        console.error(`❌ Missing required environment variable: ${name}`);
        process.exit(1);
    }
    return value;
}

function optional(name, fallback) {
    return process.env[name] || fallback;
}

function intEnv(name, fallback) {
    const parsed = parseInt(process.env[name], 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const isProduction = optional('NODE_ENV', 'production') === 'production';

// A short or default JWT secret means anyone can mint an admin session.
const jwtSecret = required('JWT_SECRET');
if (jwtSecret.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters');
    process.exit(1);
}

export const config = {
    isProduction,
    port: intEnv('PORT', 3000),

    databaseUrl: required('DATABASE_URL'),

    jwt: {
        secret: jwtSecret,
        // Sessions are revocable server-side, so a longer cookie life is fine.
        sessionDays: intEnv('SESSION_DAYS', 7),
    },

    openRouter: {
        apiKey: required('OPENROUTER_API_KEY'),
        // Overridable so the upstream call can be pointed at a local mock in
        // tests, or at a gateway/proxy in front of OpenRouter. Defaults to the
        // real endpoint, so nothing changes unless it is set deliberately.
        url: optional('OPENROUTER_URL', 'https://openrouter.ai/api/v1/chat/completions'),

        // THE model the server uses. Changing it here changes it everywhere —
        // the client's requested model is only honoured when it appears in
        // allowedModels below, so this is the single source of truth.
        model: optional('OPENROUTER_MODEL', 'google/gemini-2.0-flash-001'),

        // Extra models a client is permitted to ask for, comma-separated.
        // Credits are priced per action, not per model, so anything reachable
        // from here must cost roughly what the default costs — otherwise a
        // caller buys an expensive completion at a fixed price. The default
        // model is always allowed and does not need listing.
        allowedModels: optional('OPENROUTER_ALLOWED_MODELS', '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean),
    },

    appUrl: optional('APP_URL', ''),

    lemon: {
        apiKey: optional('LEMONSQUEEZY_API_KEY', ''),
        webhookSecret: optional('LEMONSQUEEZY_WEBHOOK_SECRET', ''),
        storeId: optional('LEMONSQUEEZY_STORE_ID', ''),
        variants: {
            basic: optional('LEMON_VARIANT_BASIC', ''),
            pro: optional('LEMON_VARIANT_PRO', ''),
            premium: optional('LEMON_VARIANT_PREMIUM', ''),
        },
    },

    rateLimit: {
        max: intEnv('RATE_LIMIT_MAX', 30),
        windowMs: intEnv('RATE_LIMIT_WINDOW', 60_000),
    },

    signupBonusCredits: intEnv('SIGNUP_BONUS_CREDITS', 20),
};

export default config;
