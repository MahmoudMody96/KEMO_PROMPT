// server/src/db.js — PostgreSQL connection pool.

import pg from 'pg';
import config from './config.js';

const { Pool } = pg;

// SSL is on by default in production unless the connection string already says
// otherwise. A managed Postgres reached over anything but a private network
// would otherwise carry credentials and every stored prompt in plaintext.
// PGSSL_NO_VERIFY=1 is the escape hatch for providers using self-signed certs.
//
// The loopback exemption matters: NODE_ENV defaults to "production" (config.js),
// which is the right default for cookie flags and error verbosity but made every
// local `npm run make-admin` / `npm run migrate` die with "the server does not
// support SSL connections" before it reached a single query. Encrypting a
// connection that never leaves the machine buys nothing, so the decision follows
// the actual destination rather than the environment label.
const isLoopbackDb = (url) => {
    try {
        const host = new URL(url).hostname.toLowerCase().replace(/^\[|\]$/g, '');
        return host === 'localhost' || host === '127.0.0.1' || host === '::1';
    } catch {
        return false;   // unparseable — assume remote and keep SSL on
    }
};

const wantsSsl = config.isProduction
    && !/sslmode=/i.test(config.databaseUrl || '')
    && !isLoopbackDb(config.databaseUrl || '');

export const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: wantsSsl ? { rejectUnauthorized: process.env.PGSSL_NO_VERIFY !== '1' } : undefined,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    // Without these, one pathological query holds a pool slot indefinitely;
    // ten of them wedge the whole API.
    statement_timeout: 15_000,
    idle_in_transaction_session_timeout: 30_000,
    application_name: 'kemo-engine',
});

pool.on('error', (err) => {
    // An idle client blowing up must not take the process with it.
    console.error('[DB] idle client error:', err.message);
});

export function query(text, params) {
    return pool.query(text, params);
}

/** First row, or null. Saves the `.rows[0]` dance at every call site. */
export async function queryOne(text, params) {
    const { rows } = await pool.query(text, params);
    return rows[0] || null;
}

/** Run a function inside a transaction, rolling back on any throw. */
export async function transaction(fn) {
    const client = await pool.connect();
    let failure;
    try {
        await client.query('BEGIN');
        const result = await fn(client);
        await client.query('COMMIT');
        return result;
    } catch (err) {
        failure = err;
        // If the connection died mid-transaction the ROLLBACK rejects too. Let
        // that surface in the log but keep throwing the original cause —
        // otherwise callers see a misleading rollback error instead of the bug.
        try {
            await client.query('ROLLBACK');
        } catch (rollbackErr) {
            console.error('[DB] rollback failed:', rollbackErr.message);
        }
        throw err;
    } finally {
        // Passing the error destroys the client instead of returning a possibly
        // poisoned connection (idle-in-failed-transaction) to the pool.
        client.release(failure);
    }
}

export async function assertConnection() {
    const { rows } = await pool.query('SELECT NOW() AS now');
    return rows[0].now;
}
