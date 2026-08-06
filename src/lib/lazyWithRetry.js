// src/lib/lazyWithRetry.js — Lazy imports that survive a stale page.
//
// A dynamic import can fail for a reason that has nothing to do with the code:
//
//   * the dev server restarted while a tab was open;
//   * a deploy shipped new hashed filenames, so the chunk the open tab is
//     asking for no longer exists on the server;
//   * the network dropped for a moment.
//
// React surfaces all of these as a render-time throw, which the ErrorBoundary
// catches and turns into a full "Application Crashed" screen — a scary,
// dead-end message for what is usually fixed by one reload.
//
// This wrapper retries once (covering a transient blip), and if the module is
// genuinely gone it reloads the page exactly once so the browser picks up the
// current build. The sessionStorage guard is what stops that becoming a reload
// loop when the failure is permanent.

import { lazy } from 'react';

const RELOAD_FLAG = 'kemo-chunk-reloaded';

const isMissingChunk = (error) => {
    const msg = String(error?.message || error);
    return /dynamically imported module|Importing a module script failed|Failed to fetch/i.test(msg);
};

/**
 * @param {() => Promise<{default: React.ComponentType}>} factory
 * @param {string} name  used only for logging
 */
export function lazyWithRetry(factory, name = 'chunk') {
    return lazy(async () => {
        try {
            const mod = await factory();
            // Loaded fine — clear the guard so a future stale deploy is allowed
            // its own single reload.
            sessionStorage.removeItem(RELOAD_FLAG);
            return mod;
        } catch (error) {
            if (!isMissingChunk(error)) throw error;

            // One quiet retry: covers a dropped request or a dev server that
            // was mid-restart.
            try {
                const mod = await factory();
                sessionStorage.removeItem(RELOAD_FLAG);
                return mod;
            } catch {
                // Still gone. If we have not already reloaded for this reason,
                // the page is stale against the server — reload once.
                if (sessionStorage.getItem(RELOAD_FLAG) !== '1') {
                    sessionStorage.setItem(RELOAD_FLAG, '1');
                    console.warn(`[lazy] ${name} unavailable — reloading for the current build`);
                    window.location.reload();
                    // Never resolves; the reload takes over before React renders.
                    return new Promise(() => { });
                }
                console.error(`[lazy] ${name} still unavailable after reload`);
                throw error;
            }
        }
    });
}
