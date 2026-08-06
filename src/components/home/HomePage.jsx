// src/components/home/HomePage.jsx
// Kemo Engine — the landing page. Public: this is what a first-time visitor
// sees, before any account exists.
//
// Built as a BENTO GRID rather than the usual centred hero stacked above a
// uniform card row. The difference is structural, not decorative: a bento
// layout lets one cell carry the headline, another run the live product, and
// smaller ones carry proof — all visible at once, at different weights. A
// centred hero can only say one thing at a time and pushes everything else
// below the fold.
//
// Anything asserted here is either a fact about the software or a description
// of what it does. There are no invented testimonials, ratings or user counts.

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
    ArrowUpRight, Sparkles, Globe, Flame, Wand2, Lock, Layers,
    ShieldCheck, Gauge, Check, ArrowRight,
} from 'lucide-react';

const TOOLS = [
    { id: 'generator', icon: Sparkles, accent: '#7C6BFF', en: 'Creative Studio', ar: 'استوديو الإبداع' },
    { id: 'promptarchitect', icon: Wand2, accent: '#A855F7', en: 'Prompt Architect', ar: 'مهندس البرومبت' },
    { id: 'trendhunter', icon: Flame, accent: '#F97316', en: 'Trend Hunter', ar: 'صائد الترندات' },
    { id: 'extractor', icon: Globe, accent: '#38BDF8', en: 'Prompt Extractor', ar: 'مستخرج البرومبتات' },
    { id: 'secretvault', icon: Lock, accent: '#F59E0B', en: 'Secret Vault', ar: 'المكتبة السرية' },
];

// A real fragment of engine output — the shape the product actually returns.
// Shown as the demonstration rather than a stock screenshot.
const SAMPLE_OUTPUT = [
    { k: 'CREF', v: 'Hero Burger — sesame bun, cartoon eyes, tiny arms' },
    { k: 'SCENE', v: 'Cairo street cart, golden hour' },
    { k: 'CAMERA', v: 'macro close-up, low angle' },
    { k: 'STYLE', v: 'chibi 3D, pastel palette, soft render' },
    { k: 'NEGATIVE', v: 'deformed face, extra eyes, style drift' },
];

// ═══════════════════════════════════════════════
// Cell — the bento primitive
// ═══════════════════════════════════════════════
const Cell = ({ className = '', children, i = 0, as: Tag = 'div', ...rest }) => (
    <Tag
        className={`surface-card rise relative overflow-hidden ${className}`}
        style={{ '--i': i }}
        {...rest}
    >
        {children}
    </Tag>
);

// ═══════════════════════════════════════════════
const HomePage = () => {
    const { isRTL, setActiveTab, updateGeneratorInput } = useAppContext();
    const { user } = useAuth();
    const [idea, setIdea] = useState('');

    // Signed in: the idea carries straight into the studio.
    // Signed out: the same action becomes the sign-up entry point, so the
    // primary CTA is one control rather than two competing ones.
    const start = (e) => {
        e?.preventDefault();
        const value = idea.trim();
        if (!user) {
            if (value) sessionStorage.setItem('kemo-pending-idea', value);
            setActiveTab('login');
            return;
        }
        if (value) updateGeneratorInput('coreIdea', value);
        setActiveTab('generator');
    };

    const openTool = (id) => setActiveTab(user ? id : 'login');

    return (
        <div className="mx-auto w-full max-w-6xl pb-16">
            {/* ── BENTO: hero grid ─────────────────────────────────────────
                Two columns on desktop. The headline cell spans both and the
                working input sits inside it, so the first thing on screen is
                also the first thing you can use. */}
            <section className="ambient grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">

                {/* Headline + live input — the dominant cell */}
                <Cell className="p-6 md:col-span-2 md:p-10" i={0}>
                    <span className="section-eyebrow">
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        {isRTL ? 'محرّك برومبتات فيديو' : 'Video prompt engine'}
                    </span>

                    <h1 className="mt-6 text-[clamp(2.25rem,1.5rem+3.6vw,4.25rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-text1">
                        {isRTL ? 'فكرة سطر واحد.' : 'One line in.'}
                        <br />
                        <span className="brand-text">
                            {isRTL ? 'سيناريو كامل.' : 'A full blueprint out.'}
                        </span>
                    </h1>

                    <p className="section-sub mt-5">
                        {isRTL
                            ? 'اكتب فكرتك بالعامية. المحرّك يطلّع سيناريو ومشاهد وشخصيات وبرومبتات صور جاهزة — بثبات في الشخصية والأسلوب عبر كل مشهد.'
                            : 'Describe it however it comes out. Get a script, scenes, characters and image prompts — with the character and style held steady across every shot.'}
                    </p>

                    <form onSubmit={start} className="mt-8">
                        <label htmlFor="landing-idea" className="sr-only">
                            {isRTL ? 'اكتب فكرة الفيديو' : 'Describe your video idea'}
                        </label>
                        <div className="surface-glass flex items-center gap-2 rounded-2xl p-2 shadow-[var(--elevation-2)] transition-colors focus-within:border-[var(--brand-border-strong)]">
                            <input
                                id="landing-idea"
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                placeholder={isRTL ? 'إعلان لمطعم برجر…' : 'A burger ad that actually sells…'}
                                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[15px] text-text1 outline-none placeholder:text-muted"
                                dir="auto"
                            />
                            <button
                                type="submit"
                                className="press focus-ring touch-target inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold on-brand text-white transition-opacity hover:opacity-90"
                                style={{
                                    background: 'linear-gradient(135deg, var(--cta-1), var(--cta-2))',
                                    boxShadow: '0 8px 26px var(--brand-tint)',
                                }}
                            >
                                {user
                                    ? (isRTL ? 'ابدأ' : 'Create')
                                    : (isRTL ? 'ابدأ مجاناً' : 'Start free')}
                                <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                            </button>
                        </div>
                        {!user && (
                            <p className="mt-3 text-xs text-muted">
                                {isRTL ? '20 رصيد مجاني عند التسجيل — بدون بطاقة.' : '20 free credits on signup — no card required.'}
                            </p>
                        )}
                    </form>
                </Cell>

                {/* Live output sample — the demonstration cell */}
                <Cell className="p-5 md:p-6" i={1}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                        {isRTL ? 'شكل المخرجات' : 'What comes out'}
                    </p>
                    <dl className="mt-4 space-y-3">
                        {SAMPLE_OUTPUT.map(({ k, v }) => (
                            <div key={k}>
                                <dt className="text-[10px] font-bold tracking-wide" style={{ color: 'var(--brand-fg)' }}>{k}</dt>
                                <dd className="mt-0.5 font-mono text-[11px] leading-relaxed text-text2" dir="ltr">{v}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-4 border-t border-border pt-3 text-[11px] leading-relaxed text-muted">
                        {isRTL
                            ? 'الوصف نفسه بيتكرر في كل مشهد — عشان الشخصية ما تتغيرش.'
                            : 'The same descriptor repeats in every shot, so the character cannot drift.'}
                    </p>
                </Cell>
            </section>

            {/* ── BENTO: capability row ────────────────────────────────────
                Asymmetric on purpose: the consistency claim is the one that
                differentiates the product, so it gets the wide cell. */}
            <section className="mt-3 grid grid-cols-1 gap-3 md:mt-4 md:grid-cols-4 md:gap-4">
                <Cell className="p-6 md:col-span-2" i={0}>
                    <ShieldCheck className="h-6 w-6" style={{ color: 'var(--brand-fg)' }} aria-hidden="true" />
                    <h2 className="mt-4 text-xl font-bold tracking-tight text-text1">
                        {isRTL ? 'الشخصية ما بتتغيّرش' : 'The character holds'}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                        {isRTL
                            ? 'وصف بصري واحد بيتكرّر في كل لقطة، ومُدقِّق بيراجع كل مشهد ويقولك لو حصل انحراف قبل ما تولّد أي صورة.'
                            : 'One visual descriptor repeats across every shot, and an audit checks each scene and flags drift before you render anything.'}
                    </p>
                    <ul className="mt-4 space-y-1.5">
                        {[
                            isRTL ? 'مرجع شخصية ثابت في كل مشهد' : 'A fixed character reference in every scene',
                            isRTL ? 'negatives مخصصة حسب نوع اللقطة' : 'Negatives tuned per shot type',
                            isRTL ? 'تدقيق آلي للانحراف' : 'Automatic drift audit',
                        ].map((line) => (
                            <li key={line} className="flex items-start gap-2 text-[13px] text-text2">
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: 'var(--brand-fg)' }} aria-hidden="true" />
                                {line}
                            </li>
                        ))}
                    </ul>
                </Cell>

                <Cell className="p-6" i={1}>
                    <Layers className="h-6 w-6" style={{ color: 'var(--brand-fg)' }} aria-hidden="true" />
                    <p className="mt-4 text-3xl font-extrabold tabular-nums text-text1">12</p>
                    <p className="mt-1 text-sm font-medium text-text1">{isRTL ? 'محرّك متخصص' : 'Specialised engines'}</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                        {isRTL ? 'أسلوب، شخصية، لهجة، نبرة، نوع — كلها منفصلة ومضبوطة.' : 'Style, character, dialect, tone and genre — each tuned separately.'}
                    </p>
                </Cell>

                <Cell className="p-6" i={2}>
                    <Gauge className="h-6 w-6" style={{ color: 'var(--brand-fg)' }} aria-hidden="true" />
                    <p className="mt-4 text-3xl font-extrabold tabular-nums text-text1">31</p>
                    <p className="mt-1 text-sm font-medium text-text1">{isRTL ? 'أسلوب بصري' : 'Visual styles'}</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                        {isRTL ? 'من بيكسار للسايبربانك للتصوير الواقعي.' : 'From Pixar to cyberpunk to documentary realism.'}
                    </p>
                </Cell>
            </section>

            {/* ── BENTO: tools ─────────────────────────────────────────────── */}
            <section className="mt-10" aria-labelledby="tools-heading">
                <h2 id="tools-heading" className="section-title">
                    {isRTL ? 'الأدوات' : 'The toolkit'}
                </h2>
                <p className="section-sub mt-2">
                    {isRTL ? 'كل أداة بتحل جزء مختلف من الشغل.' : 'Each one solves a different part of the job.'}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
                    {TOOLS.map((tool, i) => (
                        <Cell
                            key={tool.id}
                            as="button"
                            i={i}
                            onClick={() => openTool(tool.id)}
                            style={{ '--accent': tool.accent, '--i': i }}
                            className="press focus-ring group flex items-center gap-4 p-5 text-start"
                        >
                            <span
                                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                                style={{
                                    background: 'color-mix(in srgb, var(--accent) 14%, transparent)',
                                    border: '1px solid color-mix(in srgb, var(--accent) 26%, transparent)',
                                }}
                            >
                                <tool.icon className="h-5 w-5" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block truncate font-semibold text-text1">{isRTL ? tool.ar : tool.en}</span>
                            </span>
                            <ArrowRight
                                className="h-4 w-4 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                                aria-hidden="true"
                            />
                        </Cell>
                    ))}
                </div>
            </section>

            {/* ── Closing CTA ──────────────────────────────────────────────── */}
            {!user && (
                <section className="ambient mt-10 overflow-hidden rounded-[28px] border border-border px-6 py-12 text-center md:py-16">
                    <h2 className="text-[clamp(1.5rem,1.1rem+2vw,2.5rem)] font-extrabold tracking-[-0.03em] text-text1">
                        {isRTL ? 'جرّبه بـ 20 رصيد مجاني' : 'Try it with 20 free credits'}
                    </h2>
                    <p className="section-sub mx-auto mt-3">
                        {isRTL ? 'من غير بطاقة. سجّل وابدأ تولّد على طول.' : 'No card. Sign up and start generating immediately.'}
                    </p>
                    <button
                        onClick={() => setActiveTab('login')}
                        className="press focus-ring touch-target mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold on-brand text-white transition-opacity hover:opacity-90"
                        style={{
                            background: 'linear-gradient(135deg, var(--cta-1), var(--cta-2))',
                            boxShadow: '0 8px 26px var(--brand-tint)',
                        }}
                    >
                        {isRTL ? 'إنشاء حساب' : 'Create an account'}
                        <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                    </button>
                </section>
            )}
        </div>
    );
};

export default HomePage;
