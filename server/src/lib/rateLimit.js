// server/src/lib/rateLimit.js — In-process rate limiter.
//
// Single container, single process, so unlike the old Vercel version this map
// is actually authoritative. It still resets on restart; per-user credits are
// what really bound spend.

const buckets = new Map();
const MAX_BUCKETS = 20_000;

export function makeLimiter({ max, windowMs, key }) {
    return function limiter(req, res, next) {
        const id = `${key}:${req.user?.id || clientIp(req)}`;
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

export function clientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded || '').split(',')[0].trim();
    return first || req.ip || 'unknown';
}
