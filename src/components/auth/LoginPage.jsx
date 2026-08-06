// src/components/auth/LoginPage.jsx
//
// Rebuilt on the shared identity layer, replacing a separate 216-line
// stylesheet of hardcoded values. Two fixes came with it:
//
//   * the page was hardcoded Arabic — every label, button and message — so an
//     English-preferring user got an Arabic login screen with no way out;
//   * it was a dead end. There was no way back to the public site once you
//     landed here, which matters now that the landing page is public.

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { Mail, Lock, User, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import Wordmark, { WordmarkMark } from '../ui/Wordmark';

const LoginPage = () => {
    const { signIn, signUp, error: authError } = useAuth();
    const { language, isRTL, setActiveTab } = useAppContext();
    const isAr = language === 'ar';

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [localError, setLocalError] = useState('');

    const error = localError || authError;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        setIsLoading(true);
        setSuccessMessage('');

        try {
            if (isSignUp) {
                const result = await signUp(email, password, displayName);
                if (result.error) setLocalError(result.error);
                else setSuccessMessage(isAr ? 'تم إنشاء الحساب بنجاح' : 'Account created');
            } else {
                const result = await signIn(email, password);
                if (result?.error) setLocalError(result.error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const field = 'h-12 w-full rounded-xl border border-border bg-[var(--bg-input)] ps-11 pe-3 text-sm text-text1 outline-none transition-colors focus:border-[var(--brand-border-strong)]';

    return (
        <div className="ambient relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
            <div className="w-full max-w-[400px]">
                {/* Back to the public site — this screen used to be inescapable. */}
                <button
                    onClick={() => setActiveTab('home')}
                    className="focus-ring mb-6 inline-flex items-center gap-1.5 rounded-lg text-sm text-muted transition-colors hover:text-text1"
                >
                    <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                    {isAr ? 'رجوع' : 'Back'}
                </button>

                <div className="surface-card p-7 md:p-8">
                    <div className="text-center">
                        <WordmarkMark size={56} className="mx-auto" />
                        <h1 className="mt-4">
                            <Wordmark size="lg" />
                        </h1>
                        <p className="mt-1.5 text-sm text-muted">
                            {isSignUp
                                ? (isAr ? 'إنشاء حساب جديد' : 'Create your account')
                                : (isAr ? 'تسجيل الدخول' : 'Sign in to continue')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-7 space-y-3.5">
                        {isSignUp && (
                            <div className="relative">
                                <label htmlFor="auth-name" className="sr-only">{isAr ? 'الاسم' : 'Name'}</label>
                                <User className="pointer-events-none absolute inset-block-0 my-auto h-4 w-4 text-muted" style={{ insetInlineStart: '0.9rem' }} aria-hidden="true" />
                                <input
                                    id="auth-name" type="text" autoComplete="name" required dir="auto"
                                    placeholder={isAr ? 'الاسم' : 'Name'}
                                    value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                                    className={field}
                                />
                            </div>
                        )}

                        <div className="relative">
                            <label htmlFor="auth-email" className="sr-only">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                            <Mail className="pointer-events-none absolute inset-block-0 my-auto h-4 w-4 text-muted" style={{ insetInlineStart: '0.9rem' }} aria-hidden="true" />
                            <input
                                id="auth-email" type="email" autoComplete="email" required dir="ltr"
                                placeholder={isAr ? 'البريد الإلكتروني' : 'Email'}
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className={field}
                            />
                        </div>

                        <div className="relative">
                            <label htmlFor="auth-password" className="sr-only">{isAr ? 'كلمة المرور' : 'Password'}</label>
                            <Lock className="pointer-events-none absolute inset-block-0 my-auto h-4 w-4 text-muted" style={{ insetInlineStart: '0.9rem' }} aria-hidden="true" />
                            <input
                                id="auth-password" type="password" required minLength={6} dir="ltr"
                                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                                placeholder={isAr ? 'كلمة المرور' : 'Password'}
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className={field}
                            />
                        </div>

                        {error && (
                            <p role="alert" className="rounded-xl px-3.5 py-2.5 text-xs leading-relaxed"
                                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)', color: '#ef4444' }}>
                                {error}
                            </p>
                        )}
                        {successMessage && (
                            <p role="status" className="rounded-xl px-3.5 py-2.5 text-xs"
                                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.28)', color: '#22c55e' }}>
                                {successMessage}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="press focus-ring touch-target inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold on-brand text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                            style={{
                                background: 'linear-gradient(135deg, var(--cta-1), var(--cta-2))',
                                boxShadow: '0 8px 26px var(--brand-tint)',
                            }}
                        >
                            {/* The label is wrapped in a <span> rather than left as a bare
                                text node. A loose text node sitting next to an element is
                                what page-translation extensions rewrite (they swap it for a
                                <font> wrapper); React still holds the original node, and the
                                next re-render crashes with "removeChild: the node to be
                                removed is not a child of this node" — which is exactly how
                                signup died. Owning an element keeps React's reference valid. */}
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                            ) : (
                                <>
                                    <span>
                                        {isSignUp
                                            ? (isAr ? 'إنشاء حساب' : 'Create account')
                                            : (isAr ? 'تسجيل الدخول' : 'Sign in')}
                                    </span>
                                    <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                                </>
                            )}
                        </button>
                    </form>

                    {isSignUp && (
                        <p className="mt-4 text-center text-[11px] text-muted">
                            {isAr ? '20 رصيد مجاني عند التسجيل — بدون بطاقة.' : '20 free credits on signup — no card required.'}
                        </p>
                    )}

                    <div className="mt-6 border-t border-border pt-5 text-center text-sm">
                        <span className="text-muted">
                            {isSignUp ? (isAr ? 'عندك حساب؟' : 'Already have an account?') : (isAr ? 'مش عندك حساب؟' : "Don't have an account?")}
                        </span>{' '}
                        <button
                            onClick={() => { setIsSignUp(!isSignUp); setSuccessMessage(''); setLocalError(''); }}
                            className="focus-ring rounded font-semibold"
                            style={{ color: 'var(--brand-fg)' }}
                        >
                            {isSignUp ? (isAr ? 'تسجيل الدخول' : 'Sign in') : (isAr ? 'إنشاء حساب' : 'Create one')}
                        </button>
                    </div>
                </div>

                <p className="mt-5 text-center text-[11px] text-muted" dir={isRTL ? 'rtl' : 'ltr'}>
                    {isAr ? 'مفتاح المزوّد مايوصلش للمتصفح أبداً.' : 'The provider key never reaches your browser.'}
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
