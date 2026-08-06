// server/src/lib/rateLimit.js — In-process rate limiter.
//
// Single container, single process, so unlike the old Vercel version this map
// is actually authoritative. It still resets on restart; per-user credits are
// what really bound spend.

const buckets = new Map();
const MAX_BUCKETS = 20_000;

/**
 * @param {object} opts
 * @param {number} opts.max        requests allowed per window
 * @param {number} opts.windowMs   window length
 * @param {string} opts.key        bucket namespace
 * @param {(req: import('express').Request) => string|null} [opts.keyFn]
 *        Overrides the default user-id/IP subject. Return null to skip.
 *        Use this for limits that must not depend on the client's IP —
 *        see the login limiter in routes/auth.js.
 */
export function makeLimiter({ max, windowMs, key, keyFn }) {
    return function limiter(req, res, next) {
        const subject = keyFn ? keyFn(req) : (req.user?.id || req.ip);
        if (subject == null) return next();

        const id = `${key}:${subject}`;
        const now = Date.now();

        if (buckets.size > MAX_BUCKETS) {
            for (const [k, v] of buckets) if (now > v.resetTime) buckets.delete(k);
            if (buckets.size > MAX_BUCKETS) buckets.clear();
        }

        const bucket = buckets.get(id) || { count: 0, resetTime: now + windowMs };
        if (now > bucket.resetTime) {
            bucket.count = 0;
            bucket.resetTime = now + windowMs;
        }
        bucket.count++;
        buckets.set(id, bucket);

        const resetIn = Math.ceil((bucket.resetTime - now) / 1000);
        res.set('X-RateLimit-Remaining', String(Math.max(0, max - bucket.count)));
        res.set('X-RateLimit-Reset', String(resetIn));

        if (bucket.count > max) {
            return res.status(429).json({
                error: `Too many requests. Try again in ${resetIn}s`,
                resetIn,
            });
        }
        next();
    };
}

// NOTE: there used to be a clientIp() helper here that read the *leftmost*
// X-Forwarded-For entry. Traefik appends to that header rather than replacing
// it, so the leftmost value is fully attacker-supplied — rotating it gave every
// request a fresh bucket and made every limit below decorative. Express's own
// req.ip honours `trust proxy: 1` (set in index.js) and resolves to what the
// proxy actually observed, so the limiter uses that instead.
//
// Caveat worth knowing: `trust proxy: 1` means Express trusts the LAST hop of
// X-Forwarded-For. Behind Traefik that is the real client, because Traefik
// appends it. But a caller who reaches the container *directly* supplies the
// only entry, so req.ip becomes forgeable again — verified by test. Anything
// that must hold regardless of network topology should therefore not key on the
// IP alone; the login route pairs its IP limit with an account-keyed one.
