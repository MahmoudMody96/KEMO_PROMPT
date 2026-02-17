// src/components/pages/PricingPage.jsx
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Check, X, Sparkles, Crown, Zap, Rocket, ArrowRight, Star } from 'lucide-react';

const PricingPage = () => {
    const { language, isRTL } = useAppContext();
    const isAr = language === 'ar';
    const [annual, setAnnual] = useState(true);

    const plans = [
        {
            id: 'free',
            nameEn: 'Free',
            nameAr: 'مجاني',
            icon: Zap,
            priceMonthly: 0,
            priceAnnual: 0,
            color: '#6b7280',
            gradient: 'from-zinc-600 to-zinc-700',
            descEn: 'Get started with basic features',
            descAr: 'ابدأ مع الميزات الأساسية',
            features: [
                { en: '5 blueprints / month', ar: '5 مخططات / شهر', included: true },
                { en: '3 prompt extractions / month', ar: '3 استخراجات / شهر', included: true },
                { en: '2 trend scans / month', ar: '2 مسح ترندات / شهر', included: true },
                { en: 'Basic Prompt Architect', ar: 'مهندس البرومبت الأساسي', included: true },
                { en: 'Secret Vault (view only)', ar: 'المكتبة السرية (عرض فقط)', included: true },
                { en: 'Priority support', ar: 'دعم أولوية', included: false },
                { en: 'API access', ar: 'وصول API', included: false },
                { en: 'Team collaboration', ar: 'تعاون الفريق', included: false },
            ],
            ctaEn: 'Current Plan',
            ctaAr: 'الخطة الحالية',
            popular: false,
        },
        {
            id: 'starter',
            nameEn: 'Starter',
            nameAr: 'المبتدئ',
            icon: Sparkles,
            priceMonthly: 9,
            priceAnnual: 7,
            color: '#3b82f6',
            gradient: 'from-blue-500 to-indigo-600',
            descEn: 'For individual creators',
            descAr: 'لصنّاع المحتوى الأفراد',
            features: [
                { en: '50 blueprints / month', ar: '50 مخطط / شهر', included: true },
                { en: '30 prompt extractions / month', ar: '30 استخراج / شهر', included: true },
                { en: '20 trend scans / month', ar: '20 مسح ترندات / شهر', included: true },
                { en: 'Full Prompt Architect', ar: 'مهندس البرومبت الكامل', included: true },
                { en: 'Full Secret Vault access', ar: 'وصول كامل للمكتبة السرية', included: true },
                { en: 'Email support', ar: 'دعم بالبريد', included: true },
                { en: 'API access', ar: 'وصول API', included: false },
                { en: 'Team collaboration', ar: 'تعاون الفريق', included: false },
            ],
            ctaEn: 'Get Started',
            ctaAr: 'ابدأ الآن',
            popular: false,
        },
        {
            id: 'pro',
            nameEn: 'Professional',
            nameAr: 'المحترف',
            icon: Crown,
            priceMonthly: 29,
            priceAnnual: 24,
            color: '#f59e0b',
            gradient: 'from-amber-500 to-orange-600',
            descEn: 'For serious content producers',
            descAr: 'لمنتجي المحتوى المحترفين',
            features: [
                { en: 'Unlimited blueprints', ar: 'مخططات غير محدودة', included: true },
                { en: 'Unlimited extractions', ar: 'استخراجات غير محدودة', included: true },
                { en: 'Unlimited trend scans', ar: 'مسح ترندات غير محدود', included: true },
                { en: 'Advanced Prompt Architect', ar: 'مهندس البرومبت المتقدم', included: true },
                { en: 'Full Secret Vault + custom', ar: 'المكتبة السرية + تخصيص', included: true },
                { en: 'Priority support 24/7', ar: 'دعم أولوية ٢٤/٧', included: true },
                { en: 'API access', ar: 'وصول API', included: true },
                { en: 'Team collaboration', ar: 'تعاون الفريق', included: false },
            ],
            ctaEn: 'Upgrade to Pro',
            ctaAr: 'ترقية للمحترف',
            popular: true,
        },
        {
            id: 'enterprise',
            nameEn: 'Enterprise',
            nameAr: 'المؤسسات',
            icon: Rocket,
            priceMonthly: 99,
            priceAnnual: 79,
            color: '#8b5cf6',
            gradient: 'from-violet-500 to-purple-700',
            descEn: 'For teams and agencies',
            descAr: 'للفرق والوكالات',
            features: [
                { en: 'Everything in Pro', ar: 'كل ميزات المحترف', included: true },
                { en: 'Unlimited everything', ar: 'كل شيء غير محدود', included: true },
                { en: 'Custom AI fine-tuning', ar: 'ضبط ذكاء اصطناعي مخصص', included: true },
                { en: 'White-label exports', ar: 'تصدير بعلامتك التجارية', included: true },
                { en: 'Custom integrations', ar: 'تكاملات مخصصة', included: true },
                { en: 'Dedicated account manager', ar: 'مدير حساب مخصص', included: true },
                { en: 'Full API + Webhooks', ar: 'واجهة برمجة + Webhooks', included: true },
                { en: 'Up to 25 team members', ar: 'حتى 25 عضو فريق', included: true },
            ],
            ctaEn: 'Contact Sales',
            ctaAr: 'تواصل مع المبيعات',
            popular: false,
        },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto pb-10" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Hero */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                    style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(139,92,246,0.08))', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">{isAr ? 'خطط الأسعار' : 'PRICING'}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                    {isAr ? 'اختر الخطة المناسبة لك' : 'Choose the Right Plan'}
                </h1>
                <p className="text-sm text-zinc-400 max-w-md mx-auto mb-6">
                    {isAr ? 'ابدأ مجاناً وقم بالترقية متى احتجت لمميزات أكثر' : 'Start free and upgrade when you need more power'}
                </p>

                {/* Billing Toggle */}
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span className={`text-xs font-semibold ${!annual ? 'text-white' : 'text-zinc-500'}`}>
                        {isAr ? 'شهري' : 'Monthly'}
                    </span>
                    <button onClick={() => setAnnual(!annual)}
                        className="relative w-12 h-6 rounded-full transition-colors"
                        style={{ background: annual ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255,255,255,0.15)' }}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${annual ? 'left-6' : 'left-0.5'}`} />
                    </button>
                    <span className={`text-xs font-semibold ${annual ? 'text-white' : 'text-zinc-500'}`}>
                        {isAr ? 'سنوي' : 'Annual'}
                    </span>
                    {annual && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {isAr ? 'وفّر 20%' : 'Save 20%'}
                        </span>
                    )}
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => {
                    const price = annual ? plan.priceAnnual : plan.priceMonthly;
                    const PlanIcon = plan.icon;
                    return (
                        <div key={plan.id}
                            className={`relative rounded-2xl p-5 transition-all duration-300 hover:translate-y-[-4px] flex flex-col ${plan.popular ? 'ring-2' : ''}`}
                            style={{
                                background: plan.popular ? `linear-gradient(145deg, ${plan.color}10, rgba(15,15,25,0.95))` : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${plan.popular ? `${plan.color}40` : 'rgba(255,255,255,0.06)'}`,
                                boxShadow: plan.popular ? `0 8px 40px ${plan.color}15` : 'none',
                                ringColor: plan.popular ? `${plan.color}40` : 'transparent',
                            }}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1 rounded-full text-[11px] font-bold text-white"
                                        style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`, boxShadow: `0 4px 15px ${plan.color}40` }}>
                                        <Star className="w-3 h-3 inline mr-1" fill="currentColor" />
                                        {isAr ? 'الأكثر شعبية' : 'MOST POPULAR'}
                                    </span>
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className={`mb-4 ${plan.popular ? 'pt-2' : ''}`}>
                                <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ background: `${plan.color}15`, border: `1px solid ${plan.color}25` }}>
                                        <PlanIcon className="w-4 h-4" style={{ color: plan.color }} />
                                    </div>
                                    <h3 className="text-base font-bold text-white">{isAr ? plan.nameAr : plan.nameEn}</h3>
                                </div>
                                <p className="text-xs text-zinc-500">{isAr ? plan.descAr : plan.descEn}</p>
                            </div>

                            {/* Price */}
                            <div className="mb-5">
                                <div className={`flex items-baseline gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-3xl font-extrabold text-white">
                                        ${price}
                                    </span>
                                    {price > 0 && (
                                        <span className="text-xs text-zinc-500">/ {isAr ? 'شهر' : 'mo'}</span>
                                    )}
                                </div>
                                {price === 0 && (
                                    <span className="text-xs text-zinc-500">{isAr ? 'مجاناً للأبد' : 'Free forever'}</span>
                                )}
                            </div>

                            {/* Features */}
                            <div className="flex-1 space-y-2 mb-5">
                                {plan.features.map((f, i) => (
                                    <div key={i} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        {f.included ? (
                                            <Check className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                                        ) : (
                                            <X className="w-3.5 h-3.5 flex-shrink-0 text-zinc-600" />
                                        )}
                                        <span className={`text-xs ${f.included ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                            {isAr ? f.ar : f.en}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <button
                                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                                style={{
                                    background: plan.popular
                                        ? `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`
                                        : `${plan.color}15`,
                                    color: plan.popular ? '#fff' : plan.color,
                                    border: `1px solid ${plan.popular ? 'transparent' : `${plan.color}25`}`,
                                }}
                            >
                                {isAr ? plan.ctaAr : plan.ctaEn}
                                <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* FAQ / Trust */}
            <div className="mt-10 text-center">
                <p className="text-xs text-zinc-500">
                    {isAr
                        ? '✨ جميع الخطط تشمل تحديثات مجانية • بدون عقود • يمكنك الإلغاء في أي وقت'
                        : '✨ All plans include free updates • No contracts • Cancel anytime'}
                </p>
            </div>
        </div>
    );
};

export default PricingPage;
