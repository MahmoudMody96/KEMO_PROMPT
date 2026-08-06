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
import { attachUser, requireAuth } from './auth/middleware.js';
import { purgeExpiredSessions } from './auth/sessions.js';
import { getSettings } from './lib/settings.js';

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
//
// The allowances below are each earned by something the app actually loads:
//   'unsafe-inline' style — Tailwind and React write inline style attributes
//   fonts.googleapis / gstatic — the webfonts in index.html
//   app.lemonsqueezy.com — the checkout overlay script and its iframe
// data: images cover the base64 uploads the extractor previews locally.
const CSP = [
    "default-src 'self'",
    "script-src 'self' https://app.lemonsqueezy.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self'",
    "frame-src https://app.lemonsqueezy.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
].join('; ');

app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    res.set('Content-Security-Policy', CSP);
    if (config.isProduction) {
        res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
});

// --- readiness ----------------------------------------------------------
// The server binds its port before touching the database. A container that
// dies on a bad DATABASE_URL leaves you nothing to inspect; one that stays up
// and reports why is diagnosable from outside.
const readiness = { db: 'connecting', migrations: 'pending', error: null };

app.get('/api/health', (req, res) => {
    const healthy = readiness.db === 'ready' && readiness.migrations === 'done';
    res.status(healthy ? 200 : 503).json({
        status: healthy ? 'ok' : 'starting',
        version: '2.0.0',
        db: readiness.db,
        migrations: readiness.migrations,
        // The detail stays in the container log. This endpoint is unauthenticated,
        // and readiness.error is the verbatim pg/migration message — during an
        // outage it would hand out things like the internal DB host or
        // 'password authentication failed for user "..."'.
        error: readiness.error ? 'unavailable' : null,
        timestamp: new Date().toISOString(),
    });
});

// Anything that needs data must wait for the database rather than throw a
// confusing 500 from deep inside a query.
function requireReady(req, res, next) {
    if (readiness.db !== 'ready' || readiness.migrations !== 'done') {
        return res.status(503).json({ error: 'Server is starting up. Please retry shortly.' });
    }
    next();
}

// --- parsers ------------------------------------------------------------
// The webhook is parsed as raw bytes because its HMAC covers exactly what
// LemonSqueezy sent; re-serialising a parsed object produces different bytes.
// body-parser marks the request as handled, so express.json() below skips it.
app.use('/api/lemonsqueezy-webhook', express.raw({ type: '*/*', limit: '1mb' }));

app.use(cookieParser());

// Session lookup costs a JWT verify plus a database round trip, so it runs for
// the API only — not for every static asset the browser requests.
app.use('/api', attachUser);

// Only the vision endpoint carries base64 images. Granting every route a 25 MB
// budget would let an anonymous caller tie up memory on the login form.
//
// This sits *below* attachUser and behind requireAuth on purpose: parsing came
// first before, so an unauthenticated caller could make the server buffer and
// JSON.parse 25 MB before ever reaching the 401 — a cheap memory-exhaustion
// primitive needing no account.
app.use('/api/vision', requireAuth, express.json({ limit: '25mb' }));
app.use(express.json({ limit: '256kb' }));

// Maintenance mode, enforced server-side so it holds for direct API callers and
// not just the UI.
//
// Three carve-outs, all load-bearing:
//   * admins keep full access, or turning maintenance ON would lock the only
//     people who can turn it OFF out of the console;
//   * /api/auth stays open so an admin can still sign in to do that;
//   * /api/health stays open (it is mounted above) so the container's probe
//     doesn't read maintenance as a crash and restart-loop the service.
async function maintenanceGate(req, res, next) {
    try {
        const { maintenanceMode } = await getSettings();
        if (!maintenanceMode || req.user?.is_admin) return next();
        return res.status(503).json({ error: 'The service is temporarily down for maintenance' });
    } catch {
        return next();   // never let a settings read failure take the API down
    }
}

// --- API ----------------------------------------------------------------
app.use('/api/auth', requireReady, authRoutes);
app.use('/api/admin', requireReady, adminRoutes);
app.use('/api', requireReady, maintenanceGate);     // everything below is gated
app.use('/api', aiRoutes);                          // /api/generate, /api/vision
app.use('/api', billingRoutes);                     // /api/create-checkout
app.use('/api/projects', projectRoutes);
app.use('/api/account', accountRoutes);

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
//
// The port opens first, then the database work happens in the background. If
// the database is unreachable the container stays up and /api/health says so,
// instead of exiting and leaving a deploy log as the only clue.
const server = app.listen(config.port, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║  🚀 Kemo Engine v2.0                       ║');
    console.log(`║  📡 http://0.0.0.0:${String(config.port).padEnd(24)}║`);
    console.log('║  🔒 auth + credits enforced                ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
});

async function connectDatabase() {
    // Postgres often takes a few seconds longer than the app to accept
    // connections on a cold start, so retry before giving up.
    for (let attempt = 1; attempt <= 10; attempt++) {
        try {
            const now = await assertConnection();
            readiness.db = 'ready';
            readiness.error = null;
            console.log(`[DB] connected (${now})`);
            return true;
        } catch (err) {
            readiness.db = 'error';
            readiness.error = err.message;
            console.error(`[DB] attempt ${attempt}/10 failed: ${err.message}`);
            await new Promise(r => setTimeout(r, 3000));
        }
    }
    console.error('❌ Database unreachable. The server is up but every data route returns 503.');
    return false;
}

async function boot() {
    if (!await connectDatabase()) return;

    try {
        await runMigrations();
        readiness.migrations = 'done';
    } catch (err) {
        readiness.migrations = 'error';
        readiness.error = err.message;
        console.error('❌ Migrations failed:', err.message);
        return;
    }

    // Cheap housekeeping; expired rows have no use.
    setInterval(() => {
        purgeExpiredSessions().catch(e => console.error('[SESSIONS] purge failed:', e.message));
    }, 6 * 60 * 60 * 1000).unref();

    console.log('[BOOT] ready');
}

boot();

// Coolify sends SIGTERM on redeploy; finish in-flight requests first.
const shutdown = (signal) => {
    console.log(`[${signal}] shutting down`);
    server.close(() => pool.end().then(() => process.exit(0)));
    setTimeout(() => process.exit(1), 10_000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
