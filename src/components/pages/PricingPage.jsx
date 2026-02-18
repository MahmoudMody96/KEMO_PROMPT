// src/components/pages/PricingPage.jsx
// LemonSqueezy checkout overlay integration
import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Sparkles, Crown, Zap, Rocket, ArrowRight, Star, ExternalLink } from 'lucide-react';

// --- LemonSqueezy Variant IDs (from .env) ---
const VARIANTS = {
    basic: import.meta.env.VITE_LEMON_VARIANT_BASIC || '1318412',
    pro: import.meta.env.VITE_LEMON_VARIANT_PRO || '1318421',
    premium: import.meta.env.VITE_LEMON_VARIANT_PREMIUM || '1318422',
};

// --- Build LemonSqueezy checkout URL ---
function buildCheckoutUrl(variantId, userId, userEmail) {
    const baseUrl = `https://kemo-prompt.lemonsqueezy.com/checkout/buy/${variantId}`;
    const params = new URLSearchParams();

    // Embed overlay parameter
    params.set('embed', '1');

    // Pass user data for webhook fulfillment
    if (userId) params.set('checkout[custom][user_id]', userId);
    if (userEmail) params.set('checkout[email]', userEmail);

    // UI customization
    params.set('checkout[button_color]', '#6366f1');

    return `${baseUrl}?${params.toString()}`;
}

const PricingPage = () => {
    const { language, isRTL } = useAppContext();
    const { user } = useAuth();
    const isAr = language === 'ar';
    const [annual, setAnnual] = useState(false);
    const [loadingPlan, setLoadingPlan] = useState(null);

    // Initialize LemonSqueezy when component mounts
    useEffect(() => {
        if (typeof window !== 'undefined' && window.createLemonSqueezy) {
            window.createLemonSqueezy();
        }
    }, []);

    // Handle checkout
    const handleCheckout = useCallback((planId) => {
        const variantId = VARIANTS[planId];
        if (!variantId) return;

        setLoadingPlan(planId);

        const checkoutUrl = buildCheckoutUrl(
            variantId,
            user?.id || '',
            user?.email || ''
        );

        // Try overlay first, fallback to redirect
        if (window.LemonSqueezy) {
            window.LemonSqueezy.Url.Open(checkoutUrl);
            setTimeout(() => setLoadingPlan(null), 1500);
        } else {
            // Fallback: direct redirect
            window.open(checkoutUrl.replace('embed=1', ''), '_blank');
            setTimeout(() => setLoadingPlan(null), 1500);
        }
    }, [user]);

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
                { en: '20 credits on signup', ar: '20 كريديت عند التسجيل', included: true },
                { en: 'Basic Prompt Architect', ar: 'مهندس البرومبت الأساسي', included: true },
                { en: 'Secret Vault (view only)', ar: 'المكتبة السرية (عرض فقط)', included: true },
                { en: 'Priority support', ar: 'دعم أولوية', included: false },
                { en: 'Unlimited generations', ar: 'توليدات غير محدودة', included: false },
            ],
            ctaEn: 'Current Plan',
            ctaAr: 'الخطة الحالية',
            popular: false,
            lemonVariant: null, // No checkout for free
        },
        {
            id: 'basic',
            nameEn: 'Basic',
            nameAr: 'الأساسي',
            icon: Sparkles,
            priceMonthly: 6.99,
            priceAnnual: 6.99,
            color: '#3b82f6',
            gradient: 'from-blue-500 to-indigo-600',
            descEn: 'For individual creators',
            descAr: 'لصنّاع المحتوى الأفراد',
            features: [
                { en: '200 credits / month', ar: '200 كريديت / شهر', included: true },
                { en: 'Full Prompt Architect', ar: 'مهندس البرومبت الكامل', included: true },
                { en: 'Full Secret Vault access', ar: 'وصول كامل للمكتبة السرية', included: true },
                { en: 'Trend Hunter access', ar: 'صيّاد الترندات', included: true },
                { en: 'Email support', ar: 'دعم بالبريد', included: true },
                { en: 'API access', ar: 'وصول API', included: false },
            ],
            ctaEn: 'Subscribe — Basic',
            ctaAr: 'اشترك — الأساسي',
            popular: false,
            lemonVariant: 'basic',
        },
        {
            id: 'pro',
            nameEn: 'Professional',
            nameAr: 'المحترف',
            icon: Crown,
            priceMonthly: 14.99,
            priceAnnual: 14.99,
            color: '#f59e0b',
            gradient: 'from-amber-500 to-orange-600',
            descEn: 'For serious content producers',
            descAr: 'لمنتجي المحتوى المحترفين',
            features: [
                { en: '500 credits / month', ar: '500 كريديت / شهر', included: true },
                { en: 'Unlimited blueprints', ar: 'مخططات غير محدودة', included: true },
                { en: 'Unlimited extractions', ar: 'استخراجات غير محدودة', included: true },
                { en: 'Advanced Prompt Architect', ar: 'مهندس البرومبت المتقدم', included: true },
                { en: 'Priority support 24/7', ar: 'دعم أولوية ٢٤/٧', included: true },
                { en: 'API access', ar: 'وصول API', included: true },
            ],
            ctaEn: 'Subscribe — Pro',
            ctaAr: 'اشترك — المحترف',
            popular: true,
            lemonVariant: 'pro',
        },
        {
            id: 'premium',
            nameEn: 'Premium',
            nameAr: 'المميز',
            icon: Rocket,
            priceMonthly: 39.99,
            priceAnnual: 39.99,
            color: '#8b5cf6',
            gradient: 'from-violet-500 to-purple-700',
            descEn: 'For teams and agencies',
            descAr: 'للفرق والوكالات',
            features: [
                { en: 'Unlimited credits', ar: 'كريديت غير محدود', included: true },
                { en: 'Everything in Pro', ar: 'كل ميزات المحترف', included: true },
                { en: 'Custom AI fine-tuning', ar: 'ضبط ذكاء اصطناعي مخصص', included: true },
                { en: 'White-label exports', ar: 'تصدير بعلامتك التجارية', included: true },
                { en: 'Dedicated account manager', ar: 'مدير حساب مخصص', included: true },
                { en: 'Up to 25 team members', ar: 'حتى 25 عضو فريق', included: true },
            ],
            ctaEn: 'Subscribe — Premium',
            ctaAr: 'اشترك — المميز',
            popular: false,
            lemonVariant: 'premium',
        },
    ];

    const currentPlan = user?.plan || 'free';

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

                {/* Current plan badge */}
                {user && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <span className="text-xs text-indigo-300">
                            {isAr ? 'خطتك الحالية:' : 'Current plan:'}{' '}
                            <strong className="text-indigo-200 uppercase">{currentPlan}</strong>
                        </span>
                    </div>
                )}
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => {
                    const price = plan.priceMonthly;
                    const PlanIcon = plan.icon;
                    const isCurrentPlan = currentPlan === plan.id;
                    const isLoading = loadingPlan === plan.id;

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

                            {/* CTA Button */}
                            <button
                                onClick={() => plan.lemonVariant && handleCheckout(plan.lemonVariant)}
                                disabled={!plan.lemonVariant || isCurrentPlan || isLoading}
                                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} ${(!plan.lemonVariant || isCurrentPlan) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'}`}
                                style={{
                                    background: plan.popular
                                        ? `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`
                                        : `${plan.color}15`,
                                    color: plan.popular ? '#fff' : plan.color,
                                    border: `1px solid ${plan.popular ? 'transparent' : `${plan.color}25`}`,
                                }}
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : isCurrentPlan ? (
                                    isAr ? '✓ خطتك الحالية' : '✓ Current Plan'
                                ) : (
                                    <>
                                        {isAr ? plan.ctaAr : plan.ctaEn}
                                        <ExternalLink className={`w-3.5 h-3.5 ${isRTL ? 'rotate-0' : ''}`} />
                                    </>
                                )}
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
                <p className="text-[10px] text-zinc-600 mt-2">
                    {isAr ? '🔒 الدفع الآمن عبر LemonSqueezy' : '🔒 Secure payments via LemonSqueezy'}
                </p>
            </div>
        </div>
    );
};

export default PricingPage;
