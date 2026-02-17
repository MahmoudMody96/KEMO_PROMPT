// src/lib/supabase.js — Supabase Client Configuration
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debug: log config status (safe — doesn't expose the key)
console.log('[Supabase] URL configured:', !!SUPABASE_URL, SUPABASE_URL ? SUPABASE_URL.substring(0, 30) + '...' : '(empty)');
console.log('[Supabase] Key configured:', !!SUPABASE_ANON_KEY, SUPABASE_ANON_KEY ? 'yes (' + SUPABASE_ANON_KEY.length + ' chars)' : '(empty)');

// Check if Supabase is configured (env vars must be set)
export const isSupabaseConfigured = () => !!SUPABASE_URL && !!SUPABASE_ANON_KEY;

let supabaseClient = null;

export const getSupabase = async () => {
    if (!isSupabaseConfigured()) {
        console.warn('[Supabase] Not configured — env vars missing');
        return null;
    }

    if (!supabaseClient) {
        try {
            supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('[Supabase] Client created successfully');
        } catch (err) {
            console.error('[Supabase] Failed to create client:', err);
            return null;
        }
    }

    return supabaseClient;
};

export default getSupabase;
