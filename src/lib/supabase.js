// src/lib/supabase.js — Supabase Client Configuration
// Uses @supabase/supabase-js (must be installed: npm install @supabase/supabase-js)

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured (env vars must be set)
export const isSupabaseConfigured = () => !!SUPABASE_URL && !!SUPABASE_ANON_KEY;

let supabaseClient = null;

/**
 * Get the Supabase client instance (lazy initialization)
 * Returns null if Supabase is not configured
 */
export const getSupabase = async () => {
    if (!isSupabaseConfigured()) return null;

    if (!supabaseClient) {
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    return supabaseClient;
};

export default getSupabase;
