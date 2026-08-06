// server/src/db.js — PostgreSQL connection pool.

import pg from 'pg';
import config from './config.js';

const { Pool } = pg;

// SSL is OPT-IN: enabled only when the connection string asks for it
// (sslmode=require / verify-*) or PGSSL=1 is set. Whether a database wants TLS
// is a property of that database, not something to infer from the environment
// label or the hostname.
//
// This is deliberately default-OFF. An earlier version turned SSL on for any
// non-loopback DB in production — but the standard Coolify/Docker deployment
// reaches its Postgres over a PRIVATE internal network on a service hostname,
// and that Postgres does NOT speak SSL. Forcing it there failed every
// connection with "the server does not support SSL connections", so the whole
// app came up with db:"error" and migrations stuck pending.
//
// A managed external DB that needs TLS (Neon, Supabase, RDS, …) advertises it
// with `sslmode=require` in DATABASE_URL — set that and SSL turns on. PGSSL=1
// is the same switch without touching the URL; PGSSL_NO_VERIFY=1 relaxes cert
// verification for providers using self-signed certs.
const wantsSsl = /sslmode=(require|verify-ca|verify-full)/i.test(config.databaseUrl || '')
    || process.env.PGSSL === '1';

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
