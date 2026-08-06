// src/lib/useCopyFeedback.js — "Copied!" feedback that cleans up after itself.
//
// The same eight-line block was hand-written in seven components, each with the
// same two defects:
//
//   * the reset timeout was never cleared, so navigating away mid-flash called
//     setState on an unmounted component;
//   * navigator.clipboard.writeText was often fired without await or .catch, so
//     the button flashed "Copied!" even when the copy had failed — which it does
//     on a non-secure origin or when the document is not focused.

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * @param {number} resetMs how long the copied state stays true
 * @returns {{copied: boolean, copy: (text: string) => Promise<boolean>}}
 */
export function useCopyFeedback(resetMs = 2000) {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            clearTimeout(timerRef.current);
        };
    }, []);

    const copy = useCallback(async (text) => {
        const value = typeof text === 'string' ? text : JSON.stringify(text, null, 2);
        try {
            await navigator.clipboard.writeText(value);
        } catch (err) {
            // Report the failure rather than showing a success that did not happen.
            console.error('[clipboard] copy failed:', err?.message || err);
            return false;
        }
        if (!mountedRef.current) return true;
        setCopied(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            if (mountedRef.current) setCopied(false);
        }, resetMs);
        return true;
    }, [resetMs]);

    return { copied, copy };
}
