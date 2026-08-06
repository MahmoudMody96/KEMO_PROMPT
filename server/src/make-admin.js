// server/src/make-admin.js — Grants admin to an account, creating it if needed.
//
// There is no way to become an admin from inside the app: `is_admin` is only
// ever read (auth/middleware.js), never written by any route. That is the right
// default — an endpoint that can promote its own caller is the first thing worth
// attacking — but it leaves no way to appoint the first admin at all. This is
// that way, and it deliberately lives outside the HTTP surface: it runs from a
// terminal on the host, not from a request.
//
// Credentials come from the environment, never from argv. Arguments land in
// shell history, in `ps` output for every other user on the box, and in Coolify's
// command log; environment variables passed inline do not.
//
// Usage — the normal path, no password involved:
//
//     1. Register through the site like any other user.
//     2. ADMIN_EMAIL=you@example.com npm run make-admin
//
// Usage — when no account exists yet and the site cannot be reached:
//
//     ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='…' npm run make-admin
//
// Promoting is idempotent: running it against an account that is already an
// admin reports so and changes nothing. An existing account's password is never
// touched — use the app's own change-password flow for that, so this script can
// never be the thing that locks you out.

import { hashPassword } from './auth/sessions.js';
import { pool, queryOne } from './db.js';

const MIN_PASSWORD = 10;

function fail(message) {
    console.error(`✗ ${message}`);
    process.exitCode = 1;
}

async function main() {
    const email = process.env.ADMIN_EMAIL?.trim();
    const password = process.env.ADMIN_PASSWORD;
    const displayName = process.env.ADMIN_NAME?.trim() || 'Admin';

    if (!email) {
        return fail('ADMIN_EMAIL is not set.\n  ADMIN_EMAIL=you@example.com npm run make-admin');
    }
    if (!email.includes('@')) {
        return fail(`"${email}" does not look like an email address.`);
    }

    // LOWER(email) is the unique index, so it has to be the lookup too —
    // matching on the raw column would miss an account registered as You@… and
    // then try to insert a duplicate.
    const existing = await queryOne(
        'SELECT id, email, is_admin FROM users WHERE LOWER(email) = LOWER($1)',
        [email],
    );

    if (existing) {
        if (existing.is_admin) {
            console.log(`· ${existing.email} is already an admin — nothing to do.`);
            return;
        }

        await queryOne(
            'UPDATE users SET is_admin = TRUE, updated_at = NOW() WHERE id = $1 RETURNING id',
            [existing.id],
        );
        console.log(`✓ ${existing.email} is now an admin.`);

        if (password) {
            console.log('· ADMIN_PASSWORD was set but ignored: the account already');
            console.log('  exists, and silently resetting a live password from a');
            console.log('  provisioning script is how people get locked out.');
        }
        return;
    }

    // ---- No such account: create one -------------------------------------
    if (!password) {
        return fail(
            `No account for ${email}.\n` +
            '  Either register through the site first and re-run this (preferred —\n' +
            '  then no password passes through this script at all), or supply one:\n' +
            "      ADMIN_EMAIL=… ADMIN_PASSWORD='…' npm run make-admin",
        );
    }
    if (password.length < MIN_PASSWORD) {
        return fail(`ADMIN_PASSWORD must be at least ${MIN_PASSWORD} characters.`);
    }

    const created = await queryOne(
        `INSERT INTO users (email, password_hash, display_name, is_admin)
         VALUES ($1, $2, $3, TRUE)
         RETURNING id, email`,
        [email, await hashPassword(password), displayName],
    );

    console.log(`✓ created ${created.email} as an admin.`);
    console.log('· Sign in and change the password from the app — a password that');
    console.log('  was typed into a shell should not stay the live one.');
}

main()
    .catch((error) => {
        console.error('✗ make-admin failed:', error.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
