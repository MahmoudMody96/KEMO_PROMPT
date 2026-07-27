// src/lib/events.js — Tiny app-wide event bus over window events.
//
// Kept separate so the auth layer and the API layer can agree on a signal
// without importing each other.

/** Fired after the backend charges credits for a request. */
export const CREDITS_CHANGED_EVENT = 'credits:changed';

export function notifyCreditsChanged() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(CREDITS_CHANGED_EVENT));
    }
}
