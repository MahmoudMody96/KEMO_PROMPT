// src/lib/useModal.js — Accessible dialog behaviour in one place.
//
// The app has six modals and none of them handled any of this: Tab walked
// straight out of the dialog into the page behind the backdrop, focus was never
// restored to whatever opened it, the background kept scrolling, and only three
// of the six closed on Escape.
//
// Usage:
//   const dialogRef = useModal(isOpen, onClose);
//   <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="...">

import { useEffect, useRef } from 'react';

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * @param {boolean}  isOpen
 * @param {() => void} onClose  called on Escape
 * @returns {React.RefObject<HTMLElement>} attach to the dialog container
 */
export function useModal(isOpen, onClose) {
    const containerRef = useRef(null);

    // Kept in a ref so a re-render with a new inline arrow does not re-run the
    // main effect and steal focus again mid-interaction. Assigned in its own
    // effect rather than during render — a render-phase ref write breaks under
    // StrictMode's double render and React's concurrent features.
    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const container = containerRef.current;
        const previouslyFocused = document.activeElement;

        // Move focus into the dialog so a keyboard or screen-reader user lands
        // inside it rather than continuing from wherever they were.
        const focusables = () => Array.from(container?.querySelectorAll(FOCUSABLE) || []);
        const first = focusables()[0];
        (first || container)?.focus?.();

        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onCloseRef.current?.();
                return;
            }
            if (e.key !== 'Tab') return;

            // Cycle within the dialog.
            const items = focusables();
            if (items.length === 0) {
                e.preventDefault();
                return;
            }
            const firstItem = items[0];
            const lastItem = items[items.length - 1];
            if (e.shiftKey && document.activeElement === firstItem) {
                e.preventDefault();
                lastItem.focus();
            } else if (!e.shiftKey && document.activeElement === lastItem) {
                e.preventDefault();
                firstItem.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown, true);

        // Stop the page behind the backdrop from scrolling.
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown, true);
            document.body.style.overflow = previousOverflow;
            // Return focus to the trigger, so the user does not get dumped at
            // the top of the document.
            if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
        };
    }, [isOpen]);

    return containerRef;
}
