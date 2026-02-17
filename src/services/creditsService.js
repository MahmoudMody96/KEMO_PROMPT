// src/services/creditsService.js — Credits & Usage Tracking
// Works in DUAL MODE:
//   LOCAL MODE: No restrictions, unlimited usage
//   SUPABASE MODE: Deducts credits, tracks usage, enforces limits

import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

// Credit costs per action
export const CREDIT_COSTS = {
    brainstorm: 1,    // Generate 6 ideas
    generate: 3,      // Generate full blueprint
    extract: 2,       // Extract from video/image
    trend_search: 1,  // Search trends
};

// Plan limits
export const PLANS = {
    free: {
        name: 'Free',
        name_ar: 'مجاني',
        credits_monthly: 20,
        price_monthly: 0,
        features: ['20 credits/month', 'Basic models', 'Community support'],
        features_ar: ['20 رصيد/شهر', 'نماذج أساسية', 'دعم مجتمعي'],
    },
    pro: {
        name: 'Pro',
        name_ar: 'احترافي',
        credits_monthly: 200,
        price_monthly: 9.99,
        features: ['200 credits/month', 'Premium models', 'Priority support', 'Export history'],
        features_ar: ['200 رصيد/شهر', 'نماذج متقدمة', 'دعم أولوية', 'تصدير التاريخ'],
    },
    enterprise: {
        name: 'Enterprise',
        name_ar: 'مؤسسي',
        credits_monthly: 1000,
        price_monthly: 29.99,
        features: ['1000 credits/month', 'All models', 'API access', 'Custom branding', 'Team features'],
        features_ar: ['1000 رصيد/شهر', 'كل النماذج', 'وصول API', 'علامة تجارية مخصصة', 'ميزات الفريق'],
    },
};

/**
 * Check if user has enough credits for an action
 * In LOCAL MODE: always returns true
 */
export async function hasCredits(userId, action) {
    if (!isSupabaseConfigured() || !userId || userId === 'guest') return true;

    try {
        const supabase = await getSupabase();
        if (!supabase) return true;

        const { data, error } = await supabase
            .from('profiles')
            .select('credits_remaining')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return (data?.credits_remaining || 0) >= (CREDIT_COSTS[action] || 1);
    } catch (err) {
        console.error('Credits check error:', err);
        return true; // Fail open for now
    }
}

/**
 * Deduct credits for an action
 * Returns { success: boolean, remaining: number }
 */
export async function deductCredits(userId, action) {
    if (!isSupabaseConfigured() || !userId || userId === 'guest') {
        return { success: true, remaining: 999 };
    }

    try {
        const supabase = await getSupabase();
        if (!supabase) return { success: true, remaining: 999 };

        const cost = CREDIT_COSTS[action] || 1;

        const { data, error } = await supabase.rpc('deduct_credits', {
            p_user_id: userId,
            p_amount: cost,
            p_type: `usage_${action}`
        });

        if (error) throw error;

        if (!data) {
            return { success: false, remaining: 0, error: 'Insufficient credits' };
        }

        // Get updated balance
        const { data: profile } = await supabase
            .from('profiles')
            .select('credits_remaining')
            .eq('id', userId)
            .single();

        return { success: true, remaining: profile?.credits_remaining || 0 };
    } catch (err) {
        console.error('Credit deduction error:', err);
        return { success: true, remaining: 999 }; // Fail open
    }
}

/**
 * Log usage event for analytics
 */
export async function logUsage(userId, action, details = {}) {
    if (!isSupabaseConfigured() || !userId || userId === 'guest') return;

    try {
        const supabase = await getSupabase();
        if (!supabase) return;

        await supabase.from('usage_logs').insert({
            user_id: userId,
            action_type: action,
            credits_consumed: CREDIT_COSTS[action] || 1,
            model_used: details.model || '',
            tokens_used: details.tokens || 0,
            input_summary: (details.summary || '').slice(0, 200),
            success: details.success !== false,
            error_message: details.error || null,
            duration_ms: details.duration || 0,
        });
    } catch (err) {
        console.error('Usage logging error:', err);
    }
}

/**
 * Save a project
 */
export async function saveProject(userId, projectData) {
    if (!isSupabaseConfigured() || !userId || userId === 'guest') {
        // Local mode: save to localStorage
        const projects = JSON.parse(localStorage.getItem('promptforge_projects') || '[]');
        const project = { ...projectData, id: Date.now().toString(), created_at: new Date().toISOString() };
        projects.unshift(project);
        localStorage.setItem('promptforge_projects', JSON.stringify(projects.slice(0, 50))); // Keep 50 max
        return project;
    }

    try {
        const supabase = await getSupabase();
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('projects')
            .insert({ user_id: userId, ...projectData })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Save project error:', err);
        return null;
    }
}

/**
 * Load user's projects
 */
export async function loadProjects(userId, limit = 20) {
    if (!isSupabaseConfigured() || !userId || userId === 'guest') {
        return JSON.parse(localStorage.getItem('promptforge_projects') || '[]');
    }

    try {
        const supabase = await getSupabase();
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('Load projects error:', err);
        return [];
    }
}

/**
 * Get user's credit balance
 */
export async function getCreditBalance(userId) {
    if (!isSupabaseConfigured() || !userId || userId === 'guest') {
        return { credits_remaining: 999, credits_used: 0, plan: 'free' };
    }

    try {
        const supabase = await getSupabase();
        if (!supabase) return { credits_remaining: 999, credits_used: 0, plan: 'free' };

        const { data, error } = await supabase
            .from('profiles')
            .select('credits_remaining, credits_used, plan')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data || { credits_remaining: 0, credits_used: 0, plan: 'free' };
    } catch (err) {
        console.error('Balance check error:', err);
        return { credits_remaining: 999, credits_used: 0, plan: 'free' };
    }
}
