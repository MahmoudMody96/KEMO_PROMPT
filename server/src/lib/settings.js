// server/src/lib/settings.js — Runtime settings, cached.
//
// These are read on paths that run for every request (maintenance gate) and on
// registration. Hitting Postgres each time would put the whole API behind one
// extra round-trip, so the row is cached briefly and invalidated on write.
//
// The TTL is short on purpose: flipping maintenance mode should take effect in
// seconds, and a stale read of any of these is harmless for that long.

import { queryOne } from '../db.js';
import config from '../config.js';

const TTL_MS = 5_000;

// Used before the table exists (first boot, mid-migration) and whenever a read
// fails. Falling back to permissive values matters: a database hiccup must not
// silently put the site into maintenance mode or block every signup.
const FALLBACK = Object.freeze({
    defaultCredits: config.signupBonusCredits,
    maxRequestsPerMin: config.rateLimit?.max ?? 60,
    maintenanceMode: false,
    signupEnabled: true,
});

let cache = null;
let cachedAt = 0;
let inFlight = null;

const shape = (row) => (row ? {
    defaultCredits: row.default_credits,
    maxRequestsPerMin: row.max_requests_per_min,
    maintenanceMode: row.maintenance_mode,
    signupEnabled: row.signup_enabled,
    updatedAt: row.updated_at,
} : { ...FALLBACK });

export function invalidateSettings() {
    cache = null;
    cachedAt = 0;
}

export async function getSettings() {
    if (cache && Date.now() - cachedAt < TTL_MS) return cache;

    // Collapse concurrent misses onto one query — otherwise a burst of traffic
    // right after expiry fires one SELECT per in-flight request.
    if (!inFlight) {
        inFlight = queryOne('SELECT * FROM app_settings WHERE id = TRUE')
            .then((row) => {
                cache = shape(row);
                cachedAt = Date.now();
                return cache;
            })
            .catch((err) => {
                console.error('[settings] read failed, using defaults:', err.message);
                return { ...FALLBACK };
            })
            .finally(() => { inFlight = null; });
    }
    return inFlight;
}

export const SETTINGS_FALLBACK = FALLBACK;
