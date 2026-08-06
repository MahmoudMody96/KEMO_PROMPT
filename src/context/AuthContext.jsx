// src/context/AuthContext.jsx — Authentication state.
//
// Talks to our own /api/auth/*. The session is an httpOnly cookie, so there is
// no token in JavaScript to store, refresh, or leak: `me()` is what tells us
// whether a session exists.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth as authApi } from '../lib/apiClient';
import { CREDITS_CHANGED_EVENT } from '../lib/events';

// Keys holding the signed-in user's own creative work. Cleared on sign-out so
// the next person on a shared machine does not see the previous user's
// generated scenarios and saved templates. Theme and language are deliberately
// kept — they are device preferences, not user content.
//
// Module scope, so the signOut callback below keeps a stable identity.
const USER_DATA_KEYS = [
    'kemo-last-scenario',
    'kemo-scenario-history',
    'pa_custom_templates',
    'promptforge_prev_ideas',
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- session bootstrap ------------------------------------------------
    const loadUser = useCallback(async () => {
        try {
            const { user: current } = await authApi.me();
            setUser(current || null);
            return current || null;
        } catch (err) {
            // Anonymous is a normal state, not a failure to report.
            console.debug('[auth] no active session:', err.message);
            setUser(null);
            return null;
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        // Wrapped so the effect body itself doesn't call setState synchronously;
        // the state change lands in the promise callback, after the render.
        const bootstrap = async () => {
            await loadUser();
            if (!cancelled) setLoading(false);
        };
        bootstrap();
        return () => { cancelled = true; };
    }, [loadUser]);

    // The backend charges credits as part of each generation, so the balance
    // in state goes stale the moment one completes.
    useEffect(() => {
        const refresh = () => { loadUser(); };
        window.addEventListener(CREDITS_CHANGED_EVENT, refresh);
        return () => window.removeEventListener(CREDITS_CHANGED_EVENT, refresh);
    }, [loadUser]);

    // --- actions ----------------------------------------------------------
    const signIn = useCallback(async (email, password) => {
        setError(null);
        try {
            const { user: signedIn } = await authApi.login(email, password);
            setUser(signedIn);
            return { data: signedIn };
        } catch (err) {
            setError(err.message);
            return { error: err.message };
        }
    }, []);

    const signUp = useCallback(async (email, password, displayName) => {
        setError(null);
        try {
            const { user: created } = await authApi.register(email, password, displayName);
            setUser(created);
            return { data: created };
        } catch (err) {
            setError(err.message);
            return { error: err.message };
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            await authApi.logout();
        } catch (err) {
            console.error('[auth] sign out failed:', err.message);
        }
        try {
            USER_DATA_KEYS.forEach(k => localStorage.removeItem(k));
        } catch (err) {
            console.error('[auth] could not clear local data:', err.message);
        }
        setUser(null);
    }, []);

    const changePassword = useCallback(async (currentPassword, newPassword) => {
        setError(null);
        try {
            await authApi.changePassword(currentPassword, newPassword);
            return { ok: true };
        } catch (err) {
            setError(err.message);
            return { error: err.message };
        }
    }, []);

    const refreshProfile = useCallback(() => loadUser(), [loadUser]);

    const value = {
        user,
        loading,
        error,
        isAdmin: user?.is_admin === true,
        credits: user?.credits_remaining ?? null,
        plan: user?.plan || 'free',
        // Auth is always available now — it ships with the server rather than
        // depending on an external service being configured.
        isAuthEnabled: true,
        profileLoading: loading,
        signIn,
        signUp,
        signOut,
        changePassword,
        refreshProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export default AuthContext;
