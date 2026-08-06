// src/components/pages/AboutPage.jsx
//
// Rebuilt on the shared identity layer (see index.css) so this page belongs to
// the same product as the landing.
//
// The previous version advertised "10K+ Active Users", "500K+ Prompts
// Generated", "99.9% Uptime" and "built with feedback from thousands of
// creators". None of those were measured, and this page is public now. They are
// replaced with figures that are true of the software and can be checked in the
// source: the engine, style, genre and character-type counts.

import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Sparkles, Target, ShieldCheck, Zap, Info } from 'lucide-react';

const AboutPage = () => {
    const { language, setActiveTab } = useAppContext();
    const isAr = language === 'ar';

    // Every number here is a count of something in the codebase.
    const facts = [
        { num: '12', en: 'Specialised engines', ar: 'محرّك متخصص' },
        { num: '31', en: 'Visual styles', ar: 'أسلوب بصري' },
        { num: '23', en: 'Content genres', ar: 'نوع محتوى' },
        { num: '16', en: 'Character types', ar: 'نوع شخصية' },
    ];

    const values = [
        {
            icon: ShieldCheck,
            titleEn: 'Consistency over volume', titleAr: 'الثبات قبل الكم',
            descEn: 'One visual descriptor repeats across every shot, and an audit flags drift before you render.',
            descAr: 'وصف بصري واحد بيتكرر في كل لقطة، ومُدقِّق بينبّهك على أي انحراف قبل ما تولّد.',
        },
        {
            icon: Sparkles,
            titleEn: 'Arabic as a first language', titleAr: 'العربية لغة أصلية',
            descEn: 'Dialect engines for Egyptian, Gulf, Levantine and more — not translated English.',
            descAr: 'محركات لهجات مصرية وخليجية وشامية وغيرها — مش ترجمة من الإنجليزي.',
        },
        {
            icon: Target,
            titleEn: 'Built for production', titleAr: 'مبني للإنتاج',
            descEn: 'Output is a shot list with prompts, negatives, dialogue and audio notes — not a paragraph.',
            descAr: 'المخرجات لوحة مشاهد ببرومبتات وnegatives وحوار وملاحظات صوت — مش فقرة كلام.',
        },
        {
            icon: Zap,
            titleEn: 'Your key stays server-side', titleAr: 'مفتاحك مايخرجش من السيرفر',
            descEn: 'The provider key never reaches the browser, and credits are priced by the server.',
            descAr: 'مفتاح المزوّد عمره ما بيوصل للمتصفح، والرصيد بيتحسب على السيرفر.',
        },
    ];

    return (
        <div className="mx-auto w-full max-w-5xl pb-16">
            <section className="ambient rounded-[28px] border border-border px-6 py-14 text-center md:py-20">
                <span className="section-eyebrow rise" style={{ '--i': 0 }}>
                    <Info className="h-3.5 w-3.5" aria-hidden="true" />
                    {isAr ? 'عنّا' : 'About'}
                </span>
                <h1 className="rise mt-6 text-[clamp(1.875rem,1.4rem+2.4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-text1" style={{ '--i': 1 }}>
                    {isAr ? 'محرّك برومبتات' : 'A prompt engine'}
                    <br />
                    <span className="brand-text">{isAr ? 'مبني للعربية' : 'built for Arabic'}</span>
                </h1>
                <p className="section-sub rise mx-auto mt-5" style={{ '--i': 2 }}>
                    {isAr
                        ? 'Kemo Engine بيحوّل فكرة سطر واحد لمخطط إنتاج كامل — سيناريو ومشاهد وشخصيات وبرومبتات صور، بثبات في الشخصية والأسلوب.'
                        : 'Kemo Engine turns a one-line idea into a full production blueprint — script, scenes, characters and image prompts, with the character and style held steady.'}
                </p>
            </section>

            <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {facts.map((f, i) => (
                    <div key={f.en} className="surface-card rise p-5 text-center" style={{ '--i': i }}>
                        <p className="text-3xl font-extrabold tabular-nums text-text1">{f.num}</p>
                        <p className="mt-1 text-xs text-muted">{isAr ? f.ar : f.en}</p>
                    </div>
                ))}
            </section>

            <section className="mt-10" aria-labelledby="values-heading">
                <h2 id="values-heading" className="section-title">{isAr ? 'مبادئنا' : 'What guides it'}</h2>
                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                    {values.map((v, i) => (
                        <div key={v.titleEn} className="surface-card rise p-6" style={{ '--i': i }}>
                            <span
                                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                                style={{ background: 'var(--brand-tint)', border: '1px solid var(--brand-border)' }}
                            >
                                <v.icon className="h-5 w-5" style={{ color: 'var(--brand-fg)' }} aria-hidden="true" />
                            </span>
                            <h3 className="text-base font-semibold text-text1">{isAr ? v.titleAr : v.titleEn}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{isAr ? v.descAr : v.descEn}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* The old CTA here was a "View Open Positions" button wired to
                nothing. Replaced with an action that actually goes somewhere. */}
            <section className="surface-card mt-10 p-8 text-center">
                <h2 className="text-xl font-bold tracking-tight text-text1">
                    {isAr ? 'عندك سؤال؟' : 'Questions?'}
                </h2>
                <p className="section-sub mx-auto mt-2">
                    {isAr ? 'ابعتلنا وهنرد عليك.' : 'Send us a message and we will get back to you.'}
                </p>
                <button
                    onClick={() => setActiveTab('contact')}
                    className="press focus-ring touch-target mt-6 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold on-brand text-white transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, var(--cta-1), var(--cta-2))' }}
                >
                    {isAr ? 'تواصل معنا' : 'Contact us'}
                </button>
            </section>
        </div>
    );
};

export default AboutPage;
