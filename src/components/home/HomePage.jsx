// src/components/home/HomePage.jsx
// Kemo Engine — SaaS Professional Homepage
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import {
    Sparkles,
    Globe,
    Flame,
    Wand2,
    Lock,
    Zap,
    Layers,
    Shield,
    Clock,
    Play,
    MousePointerClick,
    Settings2,
    Rocket,
    TrendingUp,
    Film,
    Cpu,
    Star,
    ArrowRight
} from 'lucide-react';

// ═══════════════════════════════════════════════
// HERO BANNER
// ═══════════════════════════════════════════════
const HeroBanner = ({ isRTL, onNavigate }) => {
    return (
        <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: 260 }}>
            {/* Gradient Background */}
            <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, #1a1040 0%, #0f172a 30%, #0c1222 60%, #111827 100%)',
            }} />

            {/* Animated Orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)' }} />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.3), transparent 70%)' }} />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }} />

            {/* Top-edge shine */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

            {/* Content */}
            <div className={`relative z-10 p-5 md:p-8 lg:p-10 flex flex-col items-center text-center`}>
                {/* Version Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
                    style={{
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1))',
                        border: '1px solid rgba(139,92,246,0.25)',
                        boxShadow: '0 0 20px rgba(139,92,246,0.08)',
                    }}>
                    <Zap className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-xs font-bold text-violet-300 tracking-wide">v10.0</span>
                    <span className="text-xs text-zinc-500">•</span>
                    <span className="text-[11px] text-zinc-400">{isRTL ? 'إصدار جديد' : 'New Release'}</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight">
                    <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Kemo Engine
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm md:text-base lg:text-lg text-zinc-400 mb-6 max-w-xl leading-relaxed px-2">
                    {isRTL
                        ? 'استوديو الذكاء الاصطناعي لإنتاج الفيديو — من الفكرة إلى السيناريو الاحترافي'
                        : 'AI-Powered Video Production Studio — From Idea to Professional Blueprint'
                    }
                </p>

                {/* Feature Pills */}
                <div className={`flex flex-wrap items-center justify-center gap-3 mb-7`}>
                    {[
                        { icon: Film, label: isRTL ? 'سيناريوهات فيديو' : 'Video Blueprints', color: 'violet' },
                        { icon: TrendingUp, label: isRTL ? 'تحليل الترندات' : 'Trend Analysis', color: 'blue' },
                        { icon: Cpu, label: isRTL ? 'محركات AI' : 'AI Engines', color: 'cyan' },
                    ].map((pill, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}>
                            <pill.icon className={`w-3.5 h-3.5 text-${pill.color}-400`} />
                            <span className="text-xs text-zinc-300 font-medium">{pill.label}</span>
                        </div>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className={`flex flex-col sm:flex-row items-center gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                    <button
                        onClick={() => onNavigate('generator')}
                        className="group flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                        style={{
                            background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                            boxShadow: '0 4px 25px rgba(124,58,237,0.3), 0 0 60px rgba(124,58,237,0.08)',
                        }}
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>{isRTL ? 'ابدأ الإبداع' : 'Start Creating'}</span>
                        <ArrowRight className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                    </button>
                    <button
                        onClick={() => onNavigate('trendhunter')}
                        className="group flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold text-zinc-300 transition-all duration-300 hover:text-white hover:scale-[1.02]"
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span>{isRTL ? 'استكشف الترندات' : 'Explore Trends'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════
// TOOL CARD — SaaS Horizontal Style with Thumbnail
// ═══════════════════════════════════════════════
const ToolCard = ({ tool, isRTL, onNavigate }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            onClick={() => onNavigate(tool.id)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`group relative w-full text-${isRTL ? 'right' : 'left'} rounded-2xl transition-all duration-300 overflow-hidden`}
            style={{
                background: hovered
                    ? `linear-gradient(135deg, ${tool.bgHover}, var(--bg-surface))`
                    : 'var(--overlay-subtle)',
                border: `1px solid ${hovered ? tool.borderHover : 'var(--border-color)'}`,
                transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: hovered ? tool.glowShadow : 'none',
                minHeight: '140px',
            }}
        >
            {/* Corner Orb */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl pointer-events-none"
                style={{ background: tool.orbColor }} />

            {/* Top-edge shine on hover */}
            <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(to right, transparent, ${tool.shineColor}, transparent)` }} />

            {/* Content area — padding only on text side */}
            <div className={`flex h-full ${isRTL ? 'flex-row-reverse' : ''}`}>
                {/* Text content */}
                <div className={`flex-1 p-5 flex flex-col justify-between min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div>
                        <div className={`flex items-center gap-2.5 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: tool.iconBg,
                                    boxShadow: hovered ? tool.iconGlow : 'none',
                                }}>
                                <tool.icon className="w-4 h-4" style={{ color: tool.iconColor }} />
                            </div>
                            <h3 className="text-[13px] font-bold text-text1">
                                {isRTL ? tool.titleAr : tool.titleEn}
                            </h3>
                        </div>
                        <p className="text-[10px] font-semibold mb-1.5" style={{ color: tool.iconColor }}>
                            {isRTL ? tool.titleEn : tool.titleAr}
                        </p>
                        <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">
                            {isRTL ? tool.descAr : tool.descEn}
                        </p>
                    </div>
                </div>

                {/* Thumbnail image — seamless blend */}
                <div className={`w-[110px] flex-shrink-0 relative self-stretch`}>
                    {/* Multi-edge fade overlay */}
                    <div className="absolute inset-0 pointer-events-none z-10"
                        style={{
                            background: `
                                linear-gradient(${isRTL ? 'to left' : 'to right'}, var(--overlay-fade) 0%, transparent 40%),
                                linear-gradient(to top, var(--overlay-fade-strong) 0%, transparent 30%),
                                linear-gradient(to bottom, var(--overlay-fade-strong) 0%, transparent 25%)
                            `,
                        }}
                    />
                    <img
                        src={tool.image}
                        alt={tool.titleEn}
                        className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-110"
                        style={{
                            opacity: hovered ? 0.9 : 0.7,
                            filter: hovered ? 'brightness(1.1) saturate(1.2)' : 'brightness(0.8) saturate(0.9)',
                        }}
                    />
                </div>
            </div>
        </button>
    );
};

// ═══════════════════════════════════════════════
// TOOLS DATA
// ═══════════════════════════════════════════════
const tools = [
    {
        id: 'generator',
        icon: Sparkles,
        titleEn: 'Creative Studio',
        titleAr: 'استوديو الإبداع',
        descEn: 'Generate professional video blueprints with AI — scripts, scenes, characters, and image prompts.',
        descAr: 'أنشئ سيناريوهات فيديو احترافية بالذكاء الاصطناعي — نصوص، مشاهد، شخصيات، وبرومبتات صور.',
        iconBg: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))',
        iconColor: '#818cf8',
        iconGlow: '0 0 20px rgba(99,102,241,0.2)',
        bgHover: 'rgba(99,102,241,0.05)',
        borderHover: 'rgba(99,102,241,0.2)',
        glowShadow: '0 8px 30px rgba(99,102,241,0.1)',
        orbColor: '#6366f1',
        shineColor: 'rgba(99,102,241,0.5)',
        image: '/images/tools/creative_studio.png',
    },
    {
        id: 'extractor',
        icon: Globe,
        titleEn: 'Prompt Extractor',
        titleAr: 'مستخرج البرومبتات',
        descEn: 'Extract prompts from images and videos — reverse-engineer any visual into reusable AI prompts.',
        descAr: 'استخرج البرومبتات من الصور والفيديو — حوّل أي مرئيات إلى برومبتات AI قابلة لإعادة الاستخدام.',
        iconBg: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(6,182,212,0.15))',
        iconColor: '#38bdf8',
        iconGlow: '0 0 20px rgba(14,165,233,0.2)',
        bgHover: 'rgba(14,165,233,0.05)',
        borderHover: 'rgba(14,165,233,0.2)',
        glowShadow: '0 8px 30px rgba(14,165,233,0.1)',
        orbColor: '#0ea5e9',
        shineColor: 'rgba(14,165,233,0.5)',
        image: '/images/tools/prompt_extractor.png',
    },
    {
        id: 'trendhunter',
        icon: Flame,
        titleEn: 'Trend Hunter',
        titleAr: 'صائد الترندات',
        descEn: 'Discover viral content ideas and trending topics — stay ahead with AI-powered trend analysis.',
        descAr: 'اكتشف أفكار المحتوى الفيروسي والمواضيع الرائجة — ابقَ في المقدمة مع تحليل الترندات بالذكاء الاصطناعي.',
        iconBg: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(239,68,68,0.15))',
        iconColor: '#fb923c',
        iconGlow: '0 0 20px rgba(249,115,22,0.2)',
        bgHover: 'rgba(249,115,22,0.05)',
        borderHover: 'rgba(249,115,22,0.2)',
        glowShadow: '0 8px 30px rgba(249,115,22,0.1)',
        orbColor: '#f97316',
        shineColor: 'rgba(249,115,22,0.5)',
        image: '/images/tools/trend_hunter.png',
    },
    {
        id: 'promptarchitect',
        icon: Wand2,
        titleEn: 'Prompt Architect',
        titleAr: 'مهندس البرومبت',
        descEn: 'Build master system prompts for any domain — software, marketing, legal, and academic fields.',
        descAr: 'ابنِ برومبتات نظامية ماستر لأي مجال — برمجيات، تسويق، قانون، وأكاديمي.',
        iconBg: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(192,38,211,0.15))',
        iconColor: '#c084fc',
        iconGlow: '0 0 20px rgba(168,85,247,0.2)',
        bgHover: 'rgba(168,85,247,0.05)',
        borderHover: 'rgba(168,85,247,0.2)',
        glowShadow: '0 8px 30px rgba(168,85,247,0.1)',
        orbColor: '#a855f7',
        shineColor: 'rgba(168,85,247,0.5)',
        image: '/images/tools/prompt_architect.png',
    },
    {
        id: 'secretvault',
        icon: Lock,
        titleEn: 'Secret Vault',
        titleAr: 'المكتبة السرية',
        descEn: 'An elite collection of the most powerful, curated prompts — ready to copy and dominate any domain.',
        descAr: 'مجموعة نخبوية من أقوى البرومبتات المصممة بعناية — جاهزة للنسخ والسيطرة على أي مجال.',
        iconBg: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.15))',
        iconColor: '#f59e0b',
        iconGlow: '0 0 20px rgba(245,158,11,0.2)',
        bgHover: 'rgba(245,158,11,0.05)',
        borderHover: 'rgba(245,158,11,0.2)',
        glowShadow: '0 8px 30px rgba(245,158,11,0.1)',
        orbColor: '#f59e0b',
        shineColor: 'rgba(245,158,11,0.5)',
        image: '/images/tools/secret_vault.png',
    },
];

// ═══════════════════════════════════════════════
// GETTING STARTED
// ═══════════════════════════════════════════════
const GettingStarted = ({ isRTL, onNavigate }) => {
    const steps = [
        {
            num: '01',
            icon: MousePointerClick,
            titleEn: 'Choose a Tool',
            titleAr: 'اختر أداة',
            descEn: 'Pick from our suite of AI-powered creative tools above.',
            descAr: 'اختر من مجموعة أدوات الذكاء الاصطناعي الإبداعية.',
            color: '#818cf8',
            bg: 'rgba(99,102,241,0.08)',
        },
        {
            num: '02',
            icon: Settings2,
            titleEn: 'Configure Settings',
            titleAr: 'اضبط الإعدادات',
            descEn: 'Set your genre, style, characters, and production parameters.',
            descAr: 'اضبط النوع والأسلوب والشخصيات وإعدادات الإنتاج.',
            color: '#38bdf8',
            bg: 'rgba(14,165,233,0.08)',
        },
        {
            num: '03',
            icon: Rocket,
            titleEn: 'Generate Content',
            titleAr: 'ولّد المحتوى',
            descEn: 'Hit generate and watch AI craft your professional blueprint.',
            descAr: 'اضغط توليد وشاهد الذكاء الاصطناعي يصمم لك المحتوى.',
            color: '#c084fc',
            bg: 'rgba(168,85,247,0.08)',
        },
    ];

    return (
        <div>
            <div className={`flex items-center gap-2.5 mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.1))' }}>
                    <Rocket className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-sm font-bold text-text1">{isRTL ? 'ابدأ في 3 خطوات' : 'Get Started in 3 Steps'}</h2>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-3`}>
                {steps.map((step, i) => (
                    <div key={i}
                        className="relative group rounded-xl p-5 transition-all duration-300 hover:translate-y-[-2px] cursor-default"
                        style={{
                            background: step.bg,
                            border: '1px solid var(--overlay-border-light)',
                        }}
                    >
                        {/* Step Number */}
                        <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-2xl font-black tracking-tighter" style={{ color: step.color, opacity: 0.3 }}>
                                {step.num}
                            </span>
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                                style={{ background: `${step.color}15`, border: `1px solid ${step.color}20` }}>
                                <step.icon className="w-4.5 h-4.5" style={{ color: step.color }} />
                            </div>
                        </div>
                        <h4 className="text-sm font-bold text-text1 mb-1">
                            {isRTL ? step.titleAr : step.titleEn}
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            {isRTL ? step.descAr : step.descEn}
                        </p>

                        {/* Connector Line (not on last) */}
                        {i < 2 && (
                            <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px"
                                style={{ background: 'var(--overlay-border)' }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════
// STATS BAR
// ═══════════════════════════════════════════════
const StatsBar = ({ isRTL }) => {
    const stats = [
        { icon: Sparkles, value: '10K+', labelEn: 'Blueprints Generated', labelAr: 'سيناريو تم توليده', color: '#818cf8' },
        { icon: Layers, value: '4', labelEn: 'AI Creative Tools', labelAr: 'أدوات ذكاء اصطناعي', color: '#38bdf8' },
        { icon: Shield, value: '99.9%', labelEn: 'Uptime Guaranteed', labelAr: 'وقت تشغيل مضمون', color: '#34d399' },
        { icon: Clock, value: '24/7', labelEn: 'Always Available', labelAr: 'متاح دائماً', color: '#fb923c' },
    ];

    return (
        <div className="rounded-xl overflow-hidden"
            style={{
                background: 'var(--overlay-subtle)',
                border: '1px solid var(--overlay-border-light)',
            }}>
            <div className={`grid grid-cols-2 md:grid-cols-4`}>
                {stats.map((stat, i) => (
                    <div key={i}
                        className={`flex items-center gap-3 p-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                        style={{
                            borderRight: i < 3 ? '1px solid var(--overlay-border-light)' : 'none',
                        }}
                    >
                        <stat.icon className="w-5 h-5 flex-shrink-0" style={{ color: stat.color }} />
                        <div className={isRTL ? 'text-right' : ''}>
                            <p className="text-base font-extrabold text-text1">{stat.value}</p>
                            <p className="text-[10px] text-zinc-500 font-medium">{isRTL ? stat.labelAr : stat.labelEn}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════
// MAIN HOMEPAGE
// ═══════════════════════════════════════════════
const HomePage = () => {
    const { setActiveTab, language, isRTL } = useAppContext();

    const handleNavigate = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div className="w-full space-y-6 pb-8" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Hero Banner */}
            <HeroBanner isRTL={isRTL} onNavigate={handleNavigate} />

            {/* AI Creative Tools Section */}
            <div>
                <div className={`flex items-center gap-2.5 mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))' }}>
                        <Layers className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h2 className="text-sm font-bold text-white">{isRTL ? 'أدوات الذكاء الاصطناعي' : 'AI Creative Tools'}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {tools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} isRTL={isRTL} onNavigate={handleNavigate} />
                    ))}
                </div>
            </div>

            {/* Getting Started */}
            <GettingStarted isRTL={isRTL} onNavigate={handleNavigate} />

            {/* Stats Bar */}
            <StatsBar isRTL={isRTL} />
        </div>
    );
};

export default HomePage;
