// src/context/AuthContext.jsx — Authentication Context
// Provides auth state throughout the app
// Works in 2 modes:
//   1. LOCAL MODE (no Supabase) — guest access, no login required
//   2. SUPABASE MODE — full auth with login/signup/OAuth

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

// Guest user for local development
const GUEST_USER = {
    id: 'guest',
    email: 'guest@local',
    display_name: 'Guest User',
    plan: 'free',
    credits_remaining: 999,
    isGuest: true
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthEnabled, setIsAuthEnabled] = useState(false);

    // Initialize auth
    useEffect(() => {
        let subscription = null;

        const init = async () => {
            try {
                if (isSupabaseConfigured()) {
                    const supabase = await getSupabase();
                    if (supabase) {
                        setIsAuthEnabled(true);

                        // Get current session
                        const { data: { session } } = await supabase.auth.getSession();
                        if (session?.user) {
                            setUser({
                                id: session.user.id,
                                email: session.user.email,
                                display_name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
                                plan: 'free',
                                credits_remaining: 50,
                                isGuest: false
                            });
                        }

                        // Listen for auth changes (with cleanup)
                        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
                            if (session?.user) {
                                setUser({
                                    id: session.user.id,
                                    email: session.user.email,
                                    display_name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
                                    plan: 'free',
                                    credits_remaining: 50,
                                    isGuest: false
                                });
                            } else {
                                setUser(null);
                            }
                        });
                        subscription = data?.subscription;
                    }
                }
                // Local mode — don't auto-login, show login page
            } catch (err) {
                console.error('Auth init error:', err);
            } finally {
                setLoading(false);
            }
        };

        init();

        // Cleanup: unsubscribe from auth changes on unmount
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []);

    // Sign up with email
    const signUp = useCallback(async (email, password, displayName) => {
        if (!isAuthEnabled) return { error: 'Auth not configured' };

        setError(null);
        try {
            const supabase = await getSupabase();
            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { display_name: displayName }
                }
            });

            if (authError) throw authError;
            return { data };
        } catch (err) {
            setError(err.message);
            return { error: err.message };
        }
    }, [isAuthEnabled]);

    // Sign in with email
    const signIn = useCallback(async (email, password) => {
        if (!isAuthEnabled) return { error: 'Auth not configured' };

        setError(null);
        try {
            const supabase = await getSupabase();
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) throw authError;
            return { data };
        } catch (err) {
            setError(err.message);
            return { error: err.message };
        }
    }, [isAuthEnabled]);

    // Sign in with Google
    const signInWithGoogle = useCallback(async () => {
        if (!isAuthEnabled) return { error: 'Auth not configured' };

        try {
            const supabase = await getSupabase();
            const { data, error: authError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });

            if (authError) throw authError;
            return { data };
        } catch (err) {
            setError(err.message);
            return { error: err.message };
        }
    }, [isAuthEnabled]);

    // Sign out
    const signOut = useCallback(async () => {
        if (!isAuthEnabled) {
            setUser(null);
            return;
        }

        try {
            const supabase = await getSupabase();
            await supabase.auth.signOut();
            setUser(null);
        } catch (err) {
            setError(err.message);
        }
    }, [isAuthEnabled]);

    // Continue as Guest (skip login)
    const continueAsGuest = useCallback(() => {
        setUser(GUEST_USER);
    }, []);

    const value = {
        user,
        loading,
        error,
        isAuthEnabled,
        isGuest: user?.isGuest || false,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        continueAsGuest,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export default AuthContext;
