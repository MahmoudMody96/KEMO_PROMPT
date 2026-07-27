// server/src/index.js — Kemo Engine: API + static host in one container.
//
// Serves the built Vite app and the API from the same origin, which is why the
// session cookie needs no CORS handling and no cross-site exemptions.

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import cookieParser from 'cookie-parser';

import config from './config.js';
import { assertConnection, pool } from './db.js';
import { runMigrations } from './migrate.js';
import { attachUser } from './auth/middleware.js';
import { purgeExpiredSessions } from './auth/sessions.js';

import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import billingRoutes from './routes/billing.js';
import projectRoutes from './routes/projects.js';
import accountRoutes from './routes/account.js';
import adminRoutes from './routes/admin.js';

const here = dirname(fileURLToPath(import.meta.url));
const distDir = join(here, '..', '..', 'dist');

const app = express();

// Traefik terminates TLS, so trust its X-Forwarded-* headers — otherwise every
// request looks like it came from the proxy and rate limiting keys collapse.
app.set('trust proxy', 1);
app.disable('x-powered-by');

// --- security headers ---------------------------------------------------
app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    if (config.isProduction) {
        res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
});

// --- health (before anything that can fail) -----------------------------
app.get('/api/health', (req, res) => res.json({
    status: 'ok',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
}));

// --- parsers ------------------------------------------------------------
// The webhook is parsed as raw bytes because its HMAC covers exactly what
// LemonSqueezy sent; re-serialising a parsed object produces different bytes.
// body-parser marks the request as handled, so express.json() below skips it.
app.use('/api/lemonsqueezy-webhook', express.raw({ type: '*/*', limit: '1mb' }));
app.use(express.json({ limit: '25mb' }));   // vision payloads carry base64 images
app.use(cookieParser());
app.use(attachUser);

// --- API ----------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api', aiRoutes);            // /api/generate, /api/vision
app.use('/api', billingRoutes);       // /api/create-checkout
app.use('/api/projects', projectRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/admin', adminRoutes);

// An unmatched /api/* must not fall through to index.html, or the client gets
// HTML where it expected JSON and the error is a mystery.
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// --- static frontend ----------------------------------------------------
if (existsSync(distDir)) {
    app.use(express.static(distDir, {
        maxAge: '1y',
        setHeaders: (res, path) => {
            // Hashed assets are immutable; index.html must never be cached or
            // users keep loading a build that points at deleted chunks.
            if (path.endsWith('index.html')) res.set('Cache-Control', 'no-cache');
        },
    }));
    app.get(/.*/, (req, res) => res.sendFile(join(distDir, 'index.html')));
} else {
    console.warn(`⚠️  No build found at ${distDir} — serving API only`);
}

// --- error handler ------------------------------------------------------
app.use((err, req, res, _next) => {
    console.error('[UNHANDLED]', err.message);
    if (res.headersSent) return;
    res.status(500).json({ error: 'Internal server error' });
});

// --- boot ---------------------------------------------------------------
async function start() {
    try {
        const now = await assertConnection();
        console.log(`[DB] connected (${now})`);
    } catch (err) {
        console.error('❌ Cannot reach the database:', err.message);
        process.exit(1);
    }

    await runMigrations();

    // Cheap housekeeping; expired rows have no use.
    setInterval(() => {
        purgeExpiredSessions().catch(e => console.error('[SESSIONS] purge failed:', e.message));
    }, 6 * 60 * 60 * 1000).unref();

    const server = app.listen(config.port, () => {
        console.log('');
        console.log('╔════════════════════════════════════════════╗');
        console.log('║  🚀 Kemo Engine v2.0                       ║');
        console.log(`║  📡 http://0.0.0.0:${String(config.port).padEnd(24)}║`);
        console.log(`║  🔒 auth + credits enforced                ║`);
        console.log('╚════════════════════════════════════════════╝');
        console.log('');
    });

    // Coolify sends SIGTERM on redeploy; finish in-flight requests first.
    const shutdown = (signal) => {
        console.log(`[${signal}] shutting down`);
        server.close(() => pool.end().then(() => process.exit(0)));
        setTimeout(() => process.exit(1), 10_000).unref();
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}

start();
