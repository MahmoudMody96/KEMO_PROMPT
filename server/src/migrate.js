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

// Arbitrary but fixed: every container must pick the same number for the lock
// to serialise them against each other.
const MIGRATION_LOCK_ID = 727212;

const isNoise = (line) => {
    const t = line.trim();
    return t === '' || t.startsWith('--');
};

/**
 * The migration files wrap themselves in BEGIN;/COMMIT;. Strip that outer pair
 * so the statements join the transaction opened by the runner instead of
 * committing on their own — otherwise the schema change and its ledger row
 * cannot be made atomic.
 *
 * This scans from each end past comments and blank lines rather than anchoring
 * a regex at position 0: both files open with a comment banner, so an anchored
 * `^\s*BEGIN;` matches nothing and the strip silently does nothing at all.
 *
 * Only a standalone `BEGIN;` / `COMMIT;` line is removed, so the plpgsql
 * BEGIN...END blocks inside function bodies are left untouched.
 */
function stripOuterTransaction(sql) {
    const lines = sql.split(/\r?\n/);

    let first = 0;
    while (first < lines.length && isNoise(lines[first])) first++;
    if (first < lines.length && /^BEGIN\s*;$/i.test(lines[first].trim())) lines[first] = '';

    let last = lines.length - 1;
    while (last >= 0 && isNoise(lines[last])) last--;
    if (last >= 0 && /^COMMIT\s*;$/i.test(lines[last].trim())) lines[last] = '';

    return lines.join('\n');
}

export async function runMigrations() {
    const client = await pool.connect();
    let failure;
    try {
        // Two containers booting together (rolling deploy, replicas > 1) would
        // otherwise both read an empty ledger and both try to apply 001. The
        // loser died on "relation already exists", which left the server up but
        // answering 503 on every data route forever, with no retry.
        await client.query('SELECT pg_advisory_lock($1)', [MIGRATION_LOCK_ID]);

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

            // The schema change and the ledger row commit together. Previously
            // the file committed itself and the ledger insert followed
            // separately, so a crash in between re-applied the migration on the
            // next boot — which for 002 silently zeroed credits_used for every
            // user who had ever been refunded.
            await client.query('BEGIN');
            try {
                await client.query(stripOuterTransaction(sql));
                await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
                await client.query('COMMIT');
            } catch (err) {
                await client.query('ROLLBACK').catch(() => {});
                throw err;
            }
            count++;
        }

        console.log(count ? `[MIGRATE] applied ${count} migration(s)` : '[MIGRATE] schema up to date');
    } catch (err) {
        failure = err;
        throw err;
    } finally {
        await client.query('SELECT pg_advisory_unlock($1)', [MIGRATION_LOCK_ID]).catch(() => {});
        client.release(failure);
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
