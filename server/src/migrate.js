// server/src/migrate.js — Applies SQL files in migrations/ once each, in order.
//
// Runs automatically at boot so a fresh Coolify deploy comes up with a working
// schema instead of waiting for someone to remember a manual step.

import { readdir, readFile } from 'node:fs/promises';
import { realpathSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

async function ensureLedger(client) {
    await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            name       TEXT PRIMARY KEY,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);
}

export async function runMigrations() {
    const client = await pool.connect();
    try {
        await ensureLedger(client);

        const { rows } = await client.query('SELECT name FROM schema_migrations');
        const applied = new Set(rows.map(r => r.name));

        const files = (await readdir(migrationsDir))
            .filter(f => f.endsWith('.sql'))
            .sort();

        let count = 0;
        for (const file of files) {
            if (applied.has(file)) continue;

            const sql = await readFile(join(migrationsDir, file), 'utf8');
            console.log(`[MIGRATE] applying ${file}`);

            // Each migration file manages its own BEGIN/COMMIT, so it is sent
            // as one statement batch and either lands whole or not at all.
            await client.query(sql);
            await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
            count++;
        }

        console.log(count ? `[MIGRATE] applied ${count} migration(s)` : '[MIGRATE] schema up to date');
    } finally {
        client.release();
    }
}

// `npm run migrate` runs this file directly; index.js imports it instead.
const runDirectly = process.argv[1]
    && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));

if (runDirectly) {
    runMigrations()
        .then(() => pool.end())
        .catch(err => {
            console.error('[MIGRATE] failed:', err.message);
            process.exit(1);
        });
}
