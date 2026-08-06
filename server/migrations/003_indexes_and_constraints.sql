-- 003 — Composite indexes for the list endpoints, plus the integrity constraints
-- that were only being enforced in application code.
--
-- Safe to re-run: every statement is guarded with IF NOT EXISTS or a catalog
-- check, so a partial application does not wedge the next boot.

BEGIN;

-- ─────────────────────────────────────────────────────────────
-- 1. INDEXES
--
-- Every list endpoint filters by owner and sorts by created_at DESC. With only
-- a single-column (user_id) index, Postgres had to sort the whole matching set
-- on each request. These composites serve the filter and the ordering together.
-- ─────────────────────────────────────────────────────────────

-- routes/projects.js: WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2
CREATE INDEX IF NOT EXISTS idx_projects_user_created
    ON projects (user_id, created_at DESC);

-- routes/account.js: WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2
-- This table grows unboundedly per user, so it benefits most.
CREATE INDEX IF NOT EXISTS idx_credit_txn_user_created
    ON credit_transactions (user_id, created_at DESC);

-- routes/admin.js: WHERE action_type = $1 ORDER BY created_at DESC LIMIT $2
CREATE INDEX IF NOT EXISTS idx_usage_action_created
    ON usage_logs (action_type, created_at DESC);

-- routes/account.js: WHERE user_id = $1 GROUP BY action_type
CREATE INDEX IF NOT EXISTS idx_usage_user_action
    ON usage_logs (user_id, action_type);

-- routes/admin.js: ORDER BY created_at DESC on the user list
CREATE INDEX IF NOT EXISTS idx_users_created
    ON users (created_at DESC);

-- The single-column indexes are now redundant: each is a left-most prefix of a
-- composite above, so the planner can use the composite for the same lookups
-- while costing less to maintain on write.
DROP INDEX IF EXISTS idx_projects_user;      -- prefix of idx_projects_user_created
DROP INDEX IF EXISTS idx_credit_txn_user;    -- prefix of idx_credit_txn_user_created
DROP INDEX IF EXISTS idx_usage_action;       -- prefix of idx_usage_action_created
DROP INDEX IF EXISTS idx_usage_user;         -- prefix of idx_usage_user_action

-- ─────────────────────────────────────────────────────────────
-- 2. CONSTRAINTS
--
-- credits_remaining >= 0 was guaranteed only by an IF inside deduct_credits.
-- Any direct SQL, future code path, or bug in the admin route could drive a
-- balance negative with nothing to stop it. These make the database itself the
-- backstop for the money columns.
--
-- NOT VALID skips the full-table scan and does not block on existing rows; the
-- constraint still applies to every INSERT and UPDATE from here on. Run
-- `ALTER TABLE ... VALIDATE CONSTRAINT ...` during a quiet period to check the
-- historical rows too.
-- ─────────────────────────────────────────────────────────────

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_credits_remaining_nonneg') THEN
        ALTER TABLE users ADD CONSTRAINT users_credits_remaining_nonneg
            CHECK (credits_remaining >= 0) NOT VALID;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_credits_used_nonneg') THEN
        ALTER TABLE users ADD CONSTRAINT users_credits_used_nonneg
            CHECK (credits_used >= 0) NOT VALID;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'credit_txn_balance_nonneg') THEN
        ALTER TABLE credit_transactions ADD CONSTRAINT credit_txn_balance_nonneg
            CHECK (balance_after >= 0) NOT VALID;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_credits_used_nonneg') THEN
        ALTER TABLE projects ADD CONSTRAINT projects_credits_used_nonneg
            CHECK (credits_used >= 0) NOT VALID;
    END IF;
END
$$;

COMMIT;
