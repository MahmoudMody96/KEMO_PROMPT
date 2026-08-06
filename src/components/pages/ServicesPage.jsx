// src/components/pages/ServicesPage.jsx
//
// Rebuilt on the shared identity layer.
//
// Two content corrections carried over from the old version:
//   * the API card claimed "Available on Pro and Enterprise plans" while also
//     being labelled "Coming Soon" — a contradiction that could influence a
//     purchase. It is not built, so it now says only that;
//   * the cards were <div onClick>, unreachable by keyboard. They are buttons.

import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Sparkles, Globe, Flame, Wand2, Lock, Code, ArrowRight, LayoutGrid } from 'lucide-react';

const ServicesPage = () => {
    const { language, setActiveTab } = useAppContext();
    const isAr = language === 'ar';

    const services = [
        {
            icon: Sparkles, accent: '#7C6BFF', tab: 'generator',
            titleEn: 'Video blueprints', titleAr: 'مخططات فيديو',
            descEn: 'A one-line idea becomes a script, scenes, characters and image prompts — with the character held steady across every shot.',
            descAr: 'فكرة سطر واحد بتبقى سيناريو ومشاهد وشخصيات وبرومبتات صور — والشخصية ثابتة في كل لقطة.',
        },
        {
            icon: Wand2, accent: '#A855F7', tab: 'promptarchitect',
            titleEn: 'Prompt engineering', titleAr: 'هندسة البرومبتات',
            descEn: 'Build master system prompts for any domain, with reasoning strategies and a quality score.',
            descAr: 'ابنِ برومبتات نظامية لأي مجال، باستراتيجيات تفكير وتقييم جودة.',
        },
        {
            icon: Flame, accent: '#F97316', tab: 'trendhunter',
            titleEn: 'Trend analysis', titleAr: 'تحليل الترندات',
            descEn: 'Decode viral formats per platform and region, then turn one into a blueprint.',
            descAr: 'فكّك الصيغ الفيروسية حسب المنصة والمنطقة، وحوّل أي واحدة لمخطط.',
        },
        {
            icon: Globe, accent: '#38BDF8', tab: 'extractor',
            titleEn: 'Prompt extraction', titleAr: 'استخراج البرومبتات',
            descEn: 'Upload an image or video and get back the prompt that would recreate it.',
            descAr: 'ارفع صورة أو فيديو وخد البرومبت اللي يعيد إنتاجه.',
        },
        {
            icon: Lock, accent: '#F59E0B', tab: 'secretvault',
            titleEn: 'Prompt library', titleAr: 'مكتبة البرومبتات',
            descEn: 'A curated collection of prompts across specialised domains, ready to copy.',
            descAr: 'مجموعة مختارة من البرومبتات في مجالات متخصصة، جاهزة للنسخ.',
        },
        {
            icon: Code, accent: '#22C55E', tab: null,
            titleEn: 'API access', titleAr: 'واجهة برمجية',
            descEn: 'Not built yet. It is not part of any plan — nothing you buy today includes it.',
            descAr: 'لسه مش موجودة. مش جزء من أي باقة — ولا اشتراك دلوقتي بيشملها.',
        },
    ];

    return (
        <div className="mx-auto w-full max-w-5xl pb-16">
            <section className="ambient rounded-[28px] border border-border px-6 py-14 text-center md:py-20">
                <span className="section-eyebrow rise" style={{ '--i': 0 }}>
                    <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
                    {isAr ? 'الخدمات' : 'Services'}
                </span>
                <h1 className="rise mt-6 text-[clamp(1.875rem,1.4rem+2.4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-text1" style={{ '--i': 1 }}>
                    {isAr ? 'خمس أدوات،' : 'Five tools,'}
                    <br />
                    <span className="brand-text">{isAr ? 'شغل واحد' : 'one workflow'}</span>
                </h1>
                <p className="section-sub rise mx-auto mt-5" style={{ '--i': 2 }}>
                    {isAr
                        ? 'كل أداة بتحل جزء مختلف من إنتاج المحتوى — والمخرجات كلها بنفس الهوية البصرية.'
                        : 'Each tool solves a different part of content production, and they all speak the same visual language.'}
                </p>
            </section>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                {services.map((svc, i) => {
                    const Icon = svc.icon;
                    const disabled = !svc.tab;
                    return (
                        <button
                            key={svc.titleEn}
                            type="button"
                            disabled={disabled}
                            onClick={() => svc.tab && setActiveTab(svc.tab)}
                            style={{ '--accent': svc.accent, '--i': i }}
                            className={`surface-card rise group p-6 text-start ${disabled ? 'cursor-default opacity-70' : 'press focus-ring'}`}
                        >
                            <span
                                className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                                style={{
                                    background: 'color-mix(in srgb, var(--accent) 14%, transparent)',
                                    border: '1px solid color-mix(in srgb, var(--accent) 26%, transparent)',
                                }}
                            >
                                <Icon className="h-5 w-5" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                            </span>
                            <h2 className="text-base font-semibold text-text1">{isAr ? svc.titleAr : svc.titleEn}</h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{isAr ? svc.descAr : svc.descEn}</p>

                            {disabled ? (
                                <span className="mt-4 inline-block text-xs font-medium text-muted">
                                    {isAr ? 'غير متاحة' : 'Not available'}
                                </span>
                            ) : (
                                <span className="accent-text mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                                    {isAr ? 'افتح الأداة' : 'Open tool'}
                                    <ArrowRight
                                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                                        aria-hidden="true"
                                    />
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ServicesPage;
