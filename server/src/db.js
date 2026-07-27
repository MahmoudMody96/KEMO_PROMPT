// server/src/db.js — PostgreSQL connection pool.

import pg from 'pg';
import config from './config.js';

const { Pool } = pg;

export const pool = new Pool({
    connectionString: config.databaseUrl,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
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
    try {
        await client.query('BEGIN');
        const result = await fn(client);
        await client.query('COMMIT');
        return result;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

export async function assertConnection() {
    const { rows } = await pool.query('SELECT NOW() AS now');
    return rows[0].now;
}
