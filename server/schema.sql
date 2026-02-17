-- ============================================================
-- PROMPTFORGE DATABASE SCHEMA v1.0
-- Supabase PostgreSQL
-- Run this in Supabase SQL Editor after creating your project
-- ============================================================
-- TODO: FUTURE FEATURE — This schema is NOT connected to the 
-- Express server yet. It represents the planned database 
-- structure for user auth, project saving, and credit system.
-- To implement: connect Supabase client in server.js
-- ============================================================

-- 1. USER PROFILES (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    display_name TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    credits_remaining INTEGER DEFAULT 20,
    credits_used INTEGER DEFAULT 0,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. PROJECTS (saved generations)
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT DEFAULT 'Untitled Project',
    core_idea TEXT DEFAULT '',
    genre TEXT DEFAULT '',
    video_style TEXT DEFAULT '',
    character_type TEXT DEFAULT '',
    specific_object TEXT DEFAULT '',
    voice_tone TEXT DEFAULT 'Professional',
    aspect_ratio TEXT DEFAULT '16:9',
    num_characters INTEGER DEFAULT 1,
    num_scenes INTEGER DEFAULT 4,
    duration INTEGER DEFAULT 30,
    
    -- Generated output (stored as JSONB)
    generated_idea JSONB DEFAULT NULL,
    generated_blueprint JSONB DEFAULT NULL,
    
    -- Metadata
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'exported', 'archived')),
    credits_used INTEGER DEFAULT 0,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USAGE LOGS (for analytics and rate limiting)
CREATE TABLE public.usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('brainstorm', 'generate', 'extract', 'trend_search')),
    credits_consumed INTEGER DEFAULT 1,
    model_used TEXT DEFAULT '',
    tokens_used INTEGER DEFAULT 0,
    input_summary TEXT DEFAULT '',  -- Short summary for analytics (NOT full prompt)
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT DEFAULT NULL,
    duration_ms INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREDIT TRANSACTIONS (audit trail)
CREATE TABLE public.credit_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,  -- Positive = earned/purchased, Negative = consumed
    balance_after INTEGER NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN (
        'signup_bonus', 'daily_free', 'purchase', 'subscription_renewal',
        'usage_brainstorm', 'usage_generate', 'usage_extract', 'usage_trend',
        'refund', 'admin_adjustment'
    )),
    description TEXT DEFAULT '',
    stripe_payment_id TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES (for performance)
-- ============================================================
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_created ON public.projects(created_at DESC);
CREATE INDEX idx_usage_user_id ON public.usage_logs(user_id);
CREATE INDEX idx_usage_action ON public.usage_logs(action_type);
CREATE INDEX idx_usage_created ON public.usage_logs(created_at DESC);
CREATE INDEX idx_credit_txn_user ON public.credit_transactions(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Users can only see their own data
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Projects: users can CRUD their own projects
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);

-- Usage logs: users can view their own
CREATE POLICY "Users can view own usage" ON public.usage_logs
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert usage" ON public.usage_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Credit transactions: users can view their own
CREATE POLICY "Users can view own transactions" ON public.credit_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- UTILITY FUNCTIONS
-- ============================================================

-- Deduct credits (atomic operation)
CREATE OR REPLACE FUNCTION public.deduct_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_type TEXT DEFAULT 'usage_generate'
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_credits INTEGER;
    v_new_balance INTEGER;
BEGIN
    -- Lock the row for update
    SELECT credits_remaining INTO v_current_credits
    FROM public.profiles
    WHERE id = p_user_id
    FOR UPDATE;
    
    IF v_current_credits < p_amount THEN
        RETURN FALSE;  -- Insufficient credits
    END IF;
    
    v_new_balance := v_current_credits - p_amount;
    
    -- Update profile
    UPDATE public.profiles
    SET credits_remaining = v_new_balance,
        credits_used = credits_used + p_amount,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Record transaction
    INSERT INTO public.credit_transactions (user_id, amount, balance_after, transaction_type)
    VALUES (p_user_id, -p_amount, v_new_balance, p_type);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add credits
CREATE OR REPLACE FUNCTION public.add_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_type TEXT DEFAULT 'purchase',
    p_description TEXT DEFAULT ''
)
RETURNS INTEGER AS $$
DECLARE
    v_new_balance INTEGER;
BEGIN
    UPDATE public.profiles
    SET credits_remaining = credits_remaining + p_amount,
        updated_at = NOW()
    WHERE id = p_user_id
    RETURNING credits_remaining INTO v_new_balance;
    
    INSERT INTO public.credit_transactions (user_id, amount, balance_after, transaction_type, description)
    VALUES (p_user_id, p_amount, v_new_balance, p_type, p_description);
    
    RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
