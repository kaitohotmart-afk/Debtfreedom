-- Migration: 006_payment_rpc.sql
-- Description: Creates the handle_payment_activation function for atomic updates.

CREATE OR REPLACE FUNCTION handle_payment_activation(
    p_user_id UUID,
    p_amount DECIMAL,
    p_transaction_id TEXT,
    p_tier TEXT,
    p_email TEXT
)
RETURNS JSON AS $$
DECLARE
    v_user_id UUID := p_user_id;
    v_result JSON;
BEGIN
    -- 1. Try to find user by email if ID is missing
    IF v_user_id IS NULL AND p_email IS NOT NULL THEN
        SELECT id INTO v_user_id FROM profiles WHERE email = p_email LIMIT 1;
    END IF;

    -- 2. Exit if no user found
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'User not found');
    END IF;

    -- 3. Insert record into payments (atomic)
    INSERT INTO payments (user_id, transaction_id, status, amount, payment_gateway, created_at)
    VALUES (v_user_id, p_transaction_id, 'completed', p_amount, 'payjsr', NOW())
    ON CONFLICT (transaction_id) DO NOTHING;

    -- 4. Update profile
    UPDATE profiles
    SET 
        payment_status = 'paid',
        payment_verified_at = NOW(),
        subscription_tier = p_tier
    WHERE id = v_user_id;

    -- 5. Initialize user progress (if not exists)
    INSERT INTO user_progress (user_id, current_day, current_week, streak_days)
    VALUES (v_user_id, 1, 1, 0)
    ON CONFLICT (user_id) DO NOTHING;

    -- 6. Log analytics event
    INSERT INTO analytics_events (event_name, user_id, metadata)
    VALUES (
        'purchase_complete', 
        v_user_id, 
        json_build_object(
            'transaction_id', p_transaction_id,
            'tier', p_tier,
            'amount', p_amount,
            'verified_method', 'rpc'
        )
    );

    RETURN json_build_object('success', true, 'user_id', v_user_id);

EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
