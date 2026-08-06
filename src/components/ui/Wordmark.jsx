// src/components/ui/Wordmark.jsx — the Kemo Prompt logo, set in type.
//
// Replaces the /logo.jpg bitmap that used to sit in the sidebar, the login card,
// the public header and the boot screen. A raster logo was the one brand element
// that could not follow the theme, went soft on high-DPI screens, and cost a
// network request before the first paint. Type has none of those problems.
//
// The lockup: "Kemo" carries the brand gradient, "Prompt" sits in the primary
// text colour. Two weights of emphasis in one phrase reads as a designed mark
// rather than a heading, and the contrast survives both themes because each half
// uses a token that already flips.

import React from 'react';

/**
 * The monogram — a "K" for places too narrow for the full name (the collapsed
 * sidebar). Still typography: a letter on the CTA ramp, which is the only brand
 * surface vetted to carry white text.
 */
export const WordmarkMark = ({ className = '', size = 36 }) => (
    <span
        aria-hidden="true"
        className={`grid shrink-0 place-items-center rounded-xl font-extrabold leading-none on-brand text-white select-none ${className}`}
        style={{
            width: size,
            height: size,
            fontSize: size * 0.5,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, var(--cta-1), var(--cta-2))',
            boxShadow: 'var(--elevation-1)',
        }}
    >
        K
    </span>
);

/**
 * The full wordmark.
 *
 * @param {'sm'|'md'|'lg'|'xl'} size  visual scale
 * @param {boolean} withMark          show the monogram alongside the name
 * @param {boolean} markOnly          monogram alone (collapsed rail)
 */
const SIZES = {
    sm: { text: 'text-sm', mark: 28 },
    md: { text: 'text-base', mark: 36 },
    lg: { text: 'text-2xl', mark: 44 },
    xl: { text: 'text-3xl md:text-4xl', mark: 56 },
};

const Wordmark = ({ size = 'md', withMark = false, markOnly = false, className = '' }) => {
    const s = SIZES[size] || SIZES.md;

    if (markOnly) return <WordmarkMark size={s.mark} className={className} />;

    const name = (
        // tracking-tight is what makes it read as a mark; at default spacing the
        // two words drift apart and look like body copy.
        <span className={`font-extrabold tracking-tight leading-none whitespace-nowrap ${s.text}`}>
            <span className="brand-text">Kemo</span>
            <span className="text-text1"> Prompt</span>
        </span>
    );

    if (!withMark) {
        return (
            <span className={`inline-flex items-center ${className}`}>
                {/* The accessible name lives here once, so the decorative mark and
                    the split-colour halves never get read out as fragments. */}
                <span className="sr-only">Kemo Prompt</span>
                <span aria-hidden="true">{name}</span>
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center gap-2.5 ${className}`}>
            <span className="sr-only">Kemo Prompt</span>
            <WordmarkMark size={s.mark} />
            <span aria-hidden="true">{name}</span>
        </span>
    );
};

export default Wordmark;
