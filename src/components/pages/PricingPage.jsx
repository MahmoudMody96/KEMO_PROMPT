// src/components/pages/PricingPage.jsx
// LemonSqueezy checkout overlay integration (API-based)
import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Sparkles, Crown, Zap, Rocket, ArrowRight, Star, ExternalLink, Loader2 } from 'lucide-react';
import { billing } from '../../lib/apiClient';

// --- LemonSqueezy Variant IDs (from .env) ---
// No hardcoded fallbacks: a missing env var must fail loudly here rather than
// send buyers to a variant that no longer exists.
const VARIANTS = {
    basic: import.meta.env.VITE_LEMON_VARIANT_BASIC || '',
    pro: import.meta.env.VITE_LEMON_VARIANT_PRO || '',
    premium: import.meta.env.VITE_LEMON_VARIANT_PREMIUM || '',
};

const PricingPage = () => {
    const { language } = useAppContext();
    const { user } = useAuth();
    const isAr = language === 'ar';
    const [loadingPlan, setLoadingPlan] = useState(null);
    const [error, setError] = useState(null);

    // Initialize LemonSqueezy overlay when component mounts
    useEffect(() => {
        if (typeof window !== 'undefined' && window.createLemonSqueezy) {
            window.createLemonSqueezy();
        }
    }, []);

    // Handle checkout via API
    const handleCheckout = useCallback(async (planId) => {
        const variantId = VARIANTS[planId];
        if (!variantId) {
            setError(isAr
                ? 'هذه الباقة غير مُعدّة حالياً — تواصل معنا'
                : 'This plan is not configured yet — please contact us');
            return;
        }
        if (!user) {
            setError(isAr ? 'سجّل الدخول أولاً لإتمام الشراء' : 'Please sign in before purchasing');
            return;
        }

        setLoadingPlan(planId);
        setError(null);

        try {
            // The server reads the buyer's identity from the session cookie —
            // sending a user id in the body would let anyone credit someone else.
            const data = await billing.createCheckout(variantId);

            if (data.url) {
                // Try overlay first
                if (window.LemonSqueezy) {
                    window.LemonSqueezy.Url.Open(data.url);
                } else {
                    // Fallback: open in new tab
                    window.open(data.url, '_blank');
                }
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err.message || (isAr ? 'حدث خطأ أثناء فتح صفحة الدفع' : 'Error opening checkout'));
        } finally {
            setTimeout(() => setLoadingPlan(null), 1000);
        }
    }, [user, isAr]);

    const plans = [
        {
            id: 'free',
            nameEn: 'Free',
            nameAr: 'مجاني',
            icon: Zap,
            priceMonthly: 0,
            color: '#6b7280',
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
            lemonVariant: null,
        },
        {
            id: 'basic',
            nameEn: 'Basic',
            nameAr: 'الأساسي',
            icon: Sparkles,
            priceMonthly: 6.99,
            color: '#3b82f6',
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
            color: '#f59e0b',
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
            color: '#8b5cf6',
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
        <div className="mx-auto w-full max-w-6xl pb-16">
            <section className="ambient rounded-[28px] border border-border px-6 py-14 text-center md:py-16">
                <span className="section-eyebrow rise" style={{ '--i': 0 }}>
                    <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                    {isAr ? 'الأسعار' : 'Pricing'}
                </span>
                <h1 className="rise mt-6 text-[clamp(1.875rem,1.4rem+2.4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-text1" style={{ '--i': 1 }}>
                    {isAr ? 'ابدأ مجاناً،' : 'Start free,'}
                    <br />
                    <span className="brand-text">{isAr ? 'وارقِ لما تحتاج' : 'upgrade when you need to'}</span>
                </h1>
                <p className="section-sub rise mx-auto mt-5" style={{ '--i': 2 }}>
                    {isAr
                        ? 'كل باقة بترصدلك رصيد شهري. الرصيد بيتخصم حسب العملية — والتوليد الفاشل بيترد.'
                        : 'Each plan gives you monthly credits. Credits are charged per action, and a failed generation is refunded.'}
                </p>

                {user && (
                    <p className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs"
                        style={{ background: 'var(--brand-tint)', border: '1px solid var(--brand-border)', color: 'var(--brand-fg)' }}>
                        {isAr ? 'خطتك الحالية:' : 'Current plan:'}{' '}
                        <strong className="uppercase">{currentPlan}</strong>
                    </p>
                )}

                {error && (
                    <p role="alert" className="mx-auto mt-4 inline-block rounded-lg px-4 py-2 text-xs"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)', color: '#ef4444' }}>
                        {error}
                    </p>
                )}
            </section>

            {/* Plans */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
                {plans.map((plan, i) => {
                    const price = plan.priceMonthly;
                    const PlanIcon = plan.icon;
                    const isCurrentPlan = currentPlan === plan.id;
                    const isLoading = loadingPlan === plan.id;
                    const disabled = !plan.lemonVariant || isCurrentPlan || isLoading;

                    return (
                        <div
                            key={plan.id}
                            style={{ '--accent': plan.color, '--i': i }}
                            className={`surface-card rise relative flex flex-col p-6 ${plan.popular ? 'md:-mt-2 md:mb-2' : ''}`}
                        >
                            {plan.popular && (
                                <span
                                    className="absolute -top-3 start-6 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide on-brand text-white"
                                    style={{ background: 'linear-gradient(135deg, var(--cta-1), var(--cta-2))' }}
                                >
                                    {isAr ? 'الأكثر اختياراً' : 'Most picked'}
                                </span>
                            )}

                            <span
                                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                                style={{
                                    background: 'color-mix(in srgb, var(--accent) 14%, transparent)',
                                    border: '1px solid color-mix(in srgb, var(--accent) 26%, transparent)',
                                }}
                            >
                                <PlanIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                            </span>

                            <h2 className="text-base font-bold text-text1">{isAr ? plan.nameAr : plan.nameEn}</h2>
                            <p className="mt-1 text-xs text-muted">{isAr ? plan.descAr : plan.descEn}</p>

                            <p className="mt-5 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold tabular-nums text-text1">${price}</span>
                                {price > 0 && <span className="text-xs text-muted">/ {isAr ? 'شهر' : 'mo'}</span>}
                            </p>
                            {price === 0 && (
                                <span className="mt-1 text-xs text-muted">{isAr ? 'مجاناً للأبد' : 'Free forever'}</span>
                            )}

                            <ul className="mt-6 flex-1 space-y-2.5">
                                {plan.features.map((f, fi) => (
                                    <li key={fi} className="flex items-start gap-2">
                                        {f.included
                                            ? <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                                            : <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />}
                                        <span className={`text-xs leading-relaxed ${f.included ? 'text-text2' : 'text-muted line-through'}`}>
                                            {isAr ? f.ar : f.en}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => plan.lemonVariant && handleCheckout(plan.lemonVariant)}
                                disabled={disabled}
                                // accent-text rather than an inline `color: var(--accent)`:
                                // the raw accent lands at 4.16:1 on the tinted button
                                // background, under the 4.5:1 minimum. The utility mixes
                                // it toward ink in light mode and toward white on dark.
                                className={`press focus-ring touch-target mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-opacity ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:opacity-90'} ${plan.popular && !disabled ? '' : 'accent-text'}`}
                                style={plan.popular && !disabled
                                    ? { background: 'linear-gradient(135deg, var(--cta-1), var(--cta-2))', color: '#fff' }
                                    : {
                                        background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                                        border: '1px solid color-mix(in srgb, var(--accent) 26%, transparent)',
                                    }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                        {isAr ? 'جارٍ التحويل…' : 'Redirecting…'}
                                    </>
                                ) : isCurrentPlan ? (
                                    isAr ? 'خطتك الحالية' : 'Current plan'
                                ) : !plan.lemonVariant ? (
                                    isAr ? 'غير متاحة' : 'Unavailable'
                                ) : (
                                    <>
                                        {isAr ? plan.ctaAr : plan.ctaEn}
                                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* What a credit buys — concrete, and matches server/src/lib/credits.js */}
            <section className="surface-card mt-4 p-6">
                <h2 className="text-base font-bold text-text1">{isAr ? 'الرصيد بيتصرف إزاي' : 'What a credit costs'}</h2>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {[
                        { en: 'Brainstorm', ar: 'عصف ذهني', c: 1 },
                        { en: 'Trend search', ar: 'بحث ترندات', c: 1 },
                        { en: 'Prompt architect', ar: 'مهندس البرومبت', c: 2 },
                        { en: 'Extract', ar: 'استخراج', c: 2 },
                        { en: 'Full blueprint', ar: 'مخطط كامل', c: 3 },
                    ].map((row) => (
                        <li key={row.en} className="rounded-xl p-3 text-center" style={{ background: 'var(--overlay-3)' }}>
                            <p className="text-xl font-bold tabular-nums text-text1">{row.c}</p>
                            <p className="mt-0.5 text-[11px] text-muted">{isAr ? row.ar : row.en}</p>
                        </li>
                    ))}
                </ul>
                <p className="mt-4 text-xs text-muted">
                    {isAr
                        ? 'لو التوليد فشل، الرصيد بيرجع تلقائياً. الدفع عبر LemonSqueezy، وتقدر تلغي في أي وقت.'
                        : 'A failed generation is refunded automatically. Payments run through LemonSqueezy, and you can cancel any time.'}
                </p>
            </section>
        </div>
    );
};

export default PricingPage;
