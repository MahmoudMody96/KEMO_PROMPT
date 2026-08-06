// src/components/ui/Wordmark.jsx — the Kemo Prompt logo, set purely in type.
//
// Replaces the /logo.jpg bitmap that used to sit in the sidebar, the login card,
// the public header and the boot screen. A raster logo was the one brand element
// that could not follow the theme, went soft on high-DPI screens, and cost a
// network request before the first paint.
//
// Deliberately NO badge, monogram or icon tile. A single letter in a rounded
// square is the default shape every generated brand kit reaches for, and it read
// as exactly that. The mark is the name itself: "Kemo" carries the brand
// gradient, "Prompt" sits in the primary text colour. Two weights of emphasis in
// one phrase is what makes it read as a designed lockup rather than a heading,
// and both halves use tokens that already flip with the theme.

import React from 'react';

const SIZES = {
    xs: 'text-[13px]',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
    xl: 'text-3xl md:text-4xl',
};

/**
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} size
 */
const Wordmark = ({ size = 'md', className = '' }) => (
    <span className={`inline-flex items-baseline ${className}`}>
        {/* The accessible name lives here once. The visible halves are hidden
            from assistive tech so the split colouring is never announced as two
            separate fragments. */}
        <span className="sr-only">Kemo Prompt</span>
        <span
            aria-hidden="true"
            // tracking-tight is doing real work: at default spacing the two
            // words drift apart and stop reading as a single mark.
            className={`font-extrabold tracking-tight leading-none whitespace-nowrap ${SIZES[size] || SIZES.md}`}
        >
            <span className="brand-text">Kemo</span>
            <span className="text-text1">&nbsp;Prompt</span>
        </span>
    </span>
);

export default Wordmark;
