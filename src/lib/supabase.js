// src/lib/supabase.js — Supabase Client Configuration
// SETUP: 1) npm install @supabase/supabase-js
//        2) Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env
//        3) Create a Supabase project at https://supabase.com

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured (env vars must be set)
export const isSupabaseConfigured = () => !!SUPABASE_URL && !!SUPABASE_ANON_KEY;

let supabaseClient = null;

/**
 * Get the Supabase client instance (lazy initialization)
 * Returns null if Supabase is not configured or not installed
 */
export const getSupabase = async () => {
    // If env vars not set, don't even try
    if (!isSupabaseConfigured()) return null;

    if (!supabaseClient) {
        try {
            // Use variable to bypass Vite's static import analysis
            const pkg = '@supabase/supabase-js';
            const mod = await import(/* @vite-ignore */ pkg);
            supabaseClient = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } catch (e) {
            console.warn('⚠️ Supabase not installed. Run: npm install @supabase/supabase-js');
            return null;
        }
    }

    return supabaseClient;
};

export default getSupabase;
