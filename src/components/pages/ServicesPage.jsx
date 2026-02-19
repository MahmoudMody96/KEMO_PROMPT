// src/components/pages/ServicesPage.jsx
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Sparkles, Globe, Flame, Wand2, Lock, Video, Palette, Code, Megaphone, ArrowRight } from 'lucide-react';

const ServicesPage = () => {
    const { language, isRTL, setActiveTab } = useAppContext();
    const isAr = language === 'ar';

    const services = [
        {
            icon: Sparkles, color: '#818cf8',
            titleEn: 'AI Video Blueprints', titleAr: 'مخططات فيديو بالذكاء الاصطناعي',
            descEn: 'Generate complete video production guides with scripts, scenes, characters, and image prompts — all powered by advanced AI.',
            descAr: 'أنشئ دليل إنتاج فيديو كامل يتضمن نصوصاً ومشاهد وشخصيات وبرومبتات صور — مدعوم بذكاء اصطناعي متقدم.',
            tab: 'generator',
        },
        {
            icon: Globe, color: '#38bdf8',
            titleEn: 'Prompt Extraction', titleAr: 'استخراج البرومبتات',
            descEn: 'Reverse-engineer any image or video into reusable AI prompts. Upload content and get production-ready prompts instantly.',
            descAr: 'حلل أي صورة أو فيديو بالهندسة العكسية واستخرج برومبتات جاهزة لإعادة إنتاج المحتوى.',
            tab: 'extractor',
        },
        {
            icon: Flame, color: '#fb923c',
            titleEn: 'Trend Analysis', titleAr: 'تحليل الترندات',
            descEn: 'Discover viral content formulas, trending hooks, and winning formats across TikTok, YouTube Shorts, and Instagram Reels.',
            descAr: 'اكتشف صيغ المحتوى الفيروسي وهوكات الترندات والصيغ الرابحة عبر تيك توك ويوتيوب شورتس وإنستاجرام.',
            tab: 'trendhunter',
        },
        {
            icon: Wand2, color: '#c084fc',
            titleEn: 'Prompt Engineering', titleAr: 'هندسة البرومبتات',
            descEn: 'Build master system prompts for any domain — software, marketing, legal, creative, and academic fields.',
            descAr: 'ابنِ برومبتات نظامية احترافية لأي مجال — البرمجيات والتسويق والقانون والإبداع.',
            tab: 'promptarchitect',
        },
        {
            icon: Lock, color: '#f59e0b',
            titleEn: 'Secret Prompt Vault', titleAr: 'المكتبة السرية',
            descEn: 'Access an elite, curated collection of the most powerful AI prompts across 8 specialized domains.',
            descAr: 'ادخل مجموعة نخبوية من أقوى 24 برومبت في 8 مجالات متخصصة — جاهزة للنسخ والاستخدام.',
            tab: 'secretvault',
        },
        {
            icon: Code, color: '#22c55e',
            titleEn: 'API & Integrations', titleAr: 'واجهة البرمجة والتكاملات',
            descEn: 'Integrate Kemo Engine into your workflow with our RESTful API. Available on Pro and Enterprise plans.',
            descAr: 'ادمج Kemo Engine في سير عملك بواسطة واجهة البرمجة. متوفر في خطتي المحترف والمؤسسات.',
            tab: null,
        },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto pb-10" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Hero */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <Palette className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300">{isAr ? 'خدماتنا' : 'OUR SERVICES'}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-text1 mb-3">
                    {isAr ? 'كل ما تحتاجه لإنشاء محتوى احترافي' : 'Everything You Need for Pro Content'}
                </h1>
                <p className="text-sm text-zinc-400 max-w-lg mx-auto">
                    {isAr ? 'أدوات ذكاء اصطناعي متكاملة تغطي دورة إنتاج المحتوى بالكامل' : 'Integrated AI tools covering the entire content production cycle'}
                </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((svc, i) => (
                    <div key={i}
                        className={`group relative p-5 rounded-2xl transition-all duration-300 hover:translate-y-[-3px] cursor-pointer ${isRTL ? 'text-right' : ''}`}
                        style={{ background: `${svc.color}06`, border: `1px solid ${svc.color}15` }}
                        onClick={() => svc.tab && setActiveTab(svc.tab)}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${svc.color}30`; e.currentTarget.style.boxShadow = `0 8px 30px ${svc.color}10`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${svc.color}15`; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: `${svc.color}15`, border: `1px solid ${svc.color}25` }}>
                                <svc.icon className="w-6 h-6" style={{ color: svc.color }} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-text1 mb-1.5">{isAr ? svc.titleAr : svc.titleEn}</h3>
                                <p className="text-xs text-zinc-400 leading-relaxed mb-3">{isAr ? svc.descAr : svc.descEn}</p>
                                {svc.tab && (
                                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                                        style={{ color: svc.color }}>
                                        {isAr ? 'جرّب الآن' : 'Try Now'} <ArrowRight className={`w-3 h-3 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                                    </span>
                                )}
                                {!svc.tab && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-500">
                                        {isAr ? 'قريباً' : 'Coming Soon'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesPage;
