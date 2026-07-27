-- ============================================================
-- MIGRATION 002 — a refund must undo the whole charge
--
-- deduct_credits raises credits_used as well as lowering the balance, but
-- add_credits only ever raised the balance. A refunded generation therefore
-- gave the money back while leaving the usage counter inflated, so every
-- upstream failure quietly overstated what the account had consumed.
--
-- Refunds now reverse both halves. Purchases still only add to the balance.
-- ============================================================

BEGIN;

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
    SET credits_remaining = credits_remaining + p_amount,
        -- GREATEST guards the counter against going negative if a refund is
        -- ever replayed against an account that has since been reset.
        credits_used = CASE
            WHEN p_type = 'refund' THEN GREATEST(0, credits_used - p_amount)
            ELSE credits_used
        END
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

-- Repair accounts already skewed by refunds issued before this fix.
UPDATE users u
SET credits_used = GREATEST(0, u.credits_used - r.refunded)
FROM (
    SELECT user_id, SUM(amount)::int AS refunded
    FROM credit_transactions
    WHERE transaction_type = 'refund'
    GROUP BY user_id
) r
WHERE u.id = r.user_id;

COMMIT;
