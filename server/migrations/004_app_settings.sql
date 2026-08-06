-- 004 — Runtime settings the admin console can actually change.
--
-- The Settings tab shipped as local React state: toggling "Maintenance Mode"
-- moved the switch, persisted nothing and gated nothing. An admin had no way to
-- tell that from a working control, which is worse than not offering it.
--
-- One row, enforced by a CHECK on a constant primary key. A key/value table
-- would need a cast and a lookup per setting; a single row gives the whole
-- config in one read and lets Postgres type-check each column.
--
-- Safe to re-run.

BEGIN;

CREATE TABLE IF NOT EXISTS app_settings (
    id                  BOOLEAN PRIMARY KEY DEFAULT TRUE,
    default_credits     INTEGER NOT NULL DEFAULT 20,
    max_requests_per_min INTEGER NOT NULL DEFAULT 60,
    maintenance_mode    BOOLEAN NOT NULL DEFAULT FALSE,
    signup_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by          UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Pins the table to exactly one row: any second INSERT collides on the
    -- primary key rather than silently creating a rival config.
    CONSTRAINT app_settings_singleton CHECK (id)
);

-- Bounds live in the database as well as the route, so a direct psql edit
-- cannot leave the app with a config it refuses to serve.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'app_settings_sane_ranges'
    ) THEN
        ALTER TABLE app_settings ADD CONSTRAINT app_settings_sane_ranges CHECK (
            default_credits BETWEEN 0 AND 100000
            AND max_requests_per_min BETWEEN 1 AND 10000
        );
    END IF;
END $$;

INSERT INTO app_settings (id) VALUES (TRUE) ON CONFLICT (id) DO NOTHING;

COMMIT;
