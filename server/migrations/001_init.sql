-- ============================================================
-- KEMO ENGINE — SELF-HOSTED SCHEMA v1.0 (PostgreSQL)
--
-- Replaces the previous Supabase schema. Differences that matter:
--
--   * Identity lives in `users` here, not `auth.users`. We issue and verify
--     our own JWTs, so there is no `auth.uid()` to build policies on.
--   * There is NO row level security. Every query goes through our own API,
--     which owns authorization. RLS protects a database that browsers talk to
--     directly; nothing but the server has credentials here.
--   * Credit movement still goes through functions so the balance update and
--     the audit row stay in one transaction.
--
-- Run once against a fresh database.
-- ============================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()

-- ------------------------------------------------------------
-- 1. USERS — identity + plan + balance in one row
-- ------------------------------------------------------------
CREATE TABLE users (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email             TEXT NOT NULL,
    password_hash     TEXT NOT NULL,
    display_name      TEXT NOT NULL DEFAULT '',
    avatar_url        TEXT NOT NULL DEFAULT '',

    plan              TEXT NOT NULL DEFAULT 'free'
                      CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
    credits_remaining INTEGER NOT NULL DEFAULT 20,
    credits_used      INTEGER NOT NULL DEFAULT 0,
    is_admin          BOOLEAN NOT NULL DEFAULT FALSE,

    lemon_customer_id     TEXT,
    lemon_subscription_id TEXT,
    lemon_order_id        TEXT,

    last_login_at     TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Emails are case-insensitive for login. A plain UNIQUE(email) would let
-- "A@x.com" and "a@x.com" both register and then race at sign-in.
CREATE UNIQUE INDEX users_email_lower_key ON users (LOWER(email));

-- ------------------------------------------------------------
-- 2. PROJECTS — saved generations
-- ------------------------------------------------------------
CREATE TABLE projects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           TEXT NOT NULL DEFAULT 'Untitled Project',
    core_idea       TEXT NOT NULL DEFAULT '',
    genre           TEXT NOT NULL DEFAULT '',
    video_style     TEXT NOT NULL DEFAULT '',
    character_type  TEXT NOT NULL DEFAULT '',
    specific_object TEXT NOT NULL DEFAULT '',
    voice_tone      TEXT NOT NULL DEFAULT 'Professional',
    aspect_ratio    TEXT NOT NULL DEFAULT '16:9',
    num_characters  INTEGER NOT NULL DEFAULT 1,
    num_scenes      INTEGER NOT NULL DEFAULT 4,
    duration        INTEGER NOT NULL DEFAULT 30,

    generated_idea      JSONB,
    generated_blueprint JSONB,

    status       TEXT NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft', 'generated', 'exported', 'archived')),
    credits_used INTEGER NOT NULL DEFAULT 0,
    is_favorite  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 3. USAGE LOGS — analytics
-- ------------------------------------------------------------
CREATE TABLE usage_logs (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_type      TEXT NOT NULL
                     CHECK (action_type IN ('brainstorm', 'generate', 'extract', 'trend_search', 'architect')),
    credits_consumed INTEGER NOT NULL DEFAULT 1,
    model_used       TEXT NOT NULL DEFAULT '',
    tokens_used      INTEGER NOT NULL DEFAULT 0,
    input_summary    TEXT NOT NULL DEFAULT '',   -- short summary, never the full prompt
    success          BOOLEAN NOT NULL DEFAULT TRUE,
    error_message    TEXT,
    duration_ms      INTEGER NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 4. CREDIT TRANSACTIONS — audit trail
-- ------------------------------------------------------------
CREATE TABLE credit_transactions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount           INTEGER NOT NULL,          -- positive = granted, negative = spent
    balance_after    INTEGER NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN (
        'signup_bonus', 'daily_free', 'purchase', 'subscription_renewal',
        'usage_brainstorm', 'usage_generate', 'usage_extract',
        'usage_trend_search', 'usage_architect',
        'refund', 'admin_adjustment'
    )),
    description    TEXT NOT NULL DEFAULT '',
    lemon_order_id TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 5. WEBHOOK EVENTS — replay protection for LemonSqueezy retries
-- ------------------------------------------------------------
CREATE TABLE webhook_events (
    id          TEXT PRIMARY KEY,
    provider    TEXT NOT NULL DEFAULT 'lemonsqueezy',
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 6. REFRESH TOKENS — lets us revoke a session server-side.
--    Only the hash is stored, so a database leak does not hand out sessions.
-- ------------------------------------------------------------
CREATE TABLE refresh_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- INDEXES
-- ------------------------------------------------------------
CREATE INDEX idx_projects_user     ON projects(user_id);
CREATE INDEX idx_projects_created  ON projects(created_at DESC);
CREATE INDEX idx_usage_user        ON usage_logs(user_id);
CREATE INDEX idx_usage_action      ON usage_logs(action_type);
CREATE INDEX idx_usage_created     ON usage_logs(created_at DESC);
CREATE INDEX idx_credit_txn_user   ON credit_transactions(user_id);
CREATE INDEX idx_refresh_user      ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_expires   ON refresh_tokens(expires_at);

-- ------------------------------------------------------------
-- TRIGGERS — keep updated_at honest
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER users_touch    BEFORE UPDATE ON users    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER projects_touch BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ------------------------------------------------------------
-- CREDIT FUNCTIONS
-- The balance change and its audit row must land together or not at all.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION deduct_credits(
    p_user_id UUID,
    p_amount  INTEGER,
    p_type    TEXT DEFAULT 'usage_generate'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_current INTEGER;
    v_new     INTEGER;
BEGIN
    IF p_amount IS NULL OR p_amount <= 0 THEN
        RAISE EXCEPTION 'deduct_credits: amount must be positive';
    END IF;

    SELECT credits_remaining INTO v_current
    FROM users WHERE id = p_user_id
    FOR UPDATE;                              -- serialise concurrent spends

    IF NOT FOUND OR v_current < p_amount THEN
        RETURN FALSE;
    END IF;

    v_new := v_current - p_amount;

    UPDATE users
    SET credits_remaining = v_new,
        credits_used      = credits_used + p_amount
    WHERE id = p_user_id;

    INSERT INTO credit_transactions (user_id, amount, balance_after, transaction_type)
    VALUES (p_user_id, -p_amount, v_new, p_type);

    RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION add_credits(
    p_user_id     UUID,
    p_amount      INTEGER,
    p_type        TEXT DEFAULT 'purchase',
    p_description TEXT DEFAULT ''
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_new INTEGER;
BEGIN
    IF p_amount IS NULL OR p_amount <= 0 THEN
        RAISE EXCEPTION 'add_credits: amount must be positive';
    END IF;

    UPDATE users
    SET credits_remaining = credits_remaining + p_amount
    WHERE id = p_user_id
    RETURNING credits_remaining INTO v_new;

    IF v_new IS NULL THEN
        RAISE EXCEPTION 'add_credits: no such user %', p_user_id;
    END IF;

    INSERT INTO credit_transactions (user_id, amount, balance_after, transaction_type, description)
    VALUES (p_user_id, p_amount, v_new, p_type, p_description);

    RETURN v_new;
END;
$$;

COMMIT;

-- ============================================================
-- AFTER RUNNING: promote yourself to admin once you've registered
--
--   UPDATE users SET is_admin = TRUE WHERE LOWER(email) = LOWER('you@example.com');
-- ============================================================
