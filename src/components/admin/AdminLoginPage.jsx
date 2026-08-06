// src/components/admin/AdminLoginPage.jsx — Admin-only login.
//
// Rebuilt on the shared identity layer, replacing a separate 290-line
// stylesheet. It also stops keeping its own `lang` state: the app already has a
// language, and a second one here meant the admin screen could disagree with
// the rest of the product about which language you had chosen.
//
// No admin allowlist lives here on purpose. Shipping one to the browser would
// publish the list of admin addresses while blocking nobody: authorisation is
// decided by users.is_admin and enforced server-side on every request.

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { Shield, Mail, Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

const AdminLoginPage = () => {
    const { signIn, isAuthEnabled } = useAuth();
    const { language, toggleLanguage } = useAppContext();
    const isAr = language === 'ar';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isAuthEnabled) {
            setError(isAr ? 'نظام المصادقة غير مُفعّل.' : 'Authentication is not configured.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn(email, password);
            if (result?.error) setError(result.error);
        } finally {
            setIsLoading(false);
        }
    };

    const field = 'h-12 w-full rounded-xl border border-border bg-[var(--bg-input)] ps-11 pe-3 text-sm text-text1 outline-none transition-colors focus:border-[var(--brand-border-strong)]';

    return (
        <div className="ambient relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
            <div className="w-full max-w-[400px]">
                <div className="mb-6 flex items-center justify-between">
                    <a href="/" className="focus-ring rounded-lg text-sm text-muted transition-colors hover:text-text1">
                        {isAr ? '→ العودة للموقع' : '← Back to site'}
                    </a>
                    <button
                        onClick={toggleLanguage}
                        className="focus-ring touch-target rounded-lg px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-text1"
                    >
                        {isAr ? 'EN' : 'عربي'}
                    </button>
                </div>

                <div className="surface-card p-7 md:p-8">
                    <div className="text-center">
                        <span
                            className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                            style={{ background: 'var(--brand-tint)', border: '1px solid var(--brand-border)' }}
                        >
                            <Shield className="h-7 w-7" style={{ color: 'var(--brand-fg)' }} aria-hidden="true" />
                        </span>
                        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-text1">
                            {isAr ? 'لوحة التحكم' : 'Admin Console'}
                        </h1>
                        <p className="mt-1.5 text-sm text-muted">
                            {isAr ? 'للمسؤولين فقط' : 'Authorised personnel only'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-7 space-y-3.5">
                        <div className="relative">
                            <label htmlFor="admin-email" className="sr-only">{isAr ? 'البريد الإلكتروني' : 'Admin email'}</label>
                            <Mail className="pointer-events-none absolute inset-block-0 my-auto h-4 w-4 text-muted" style={{ insetInlineStart: '0.9rem' }} aria-hidden="true" />
                            <input
                                id="admin-email" type="email" autoComplete="email" required dir="ltr"
                                placeholder={isAr ? 'البريد الإلكتروني' : 'Admin email'}
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className={field}
                            />
                        </div>

                        <div className="relative">
                            <label htmlFor="admin-password" className="sr-only">{isAr ? 'كلمة المرور' : 'Password'}</label>
                            <Lock className="pointer-events-none absolute inset-block-0 my-auto h-4 w-4 text-muted" style={{ insetInlineStart: '0.9rem' }} aria-hidden="true" />
                            <input
                                id="admin-password" type="password" autoComplete="current-password" required dir="ltr"
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="press focus-ring touch-target inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold on-brand text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                            style={{
                                background: 'linear-gradient(135deg, var(--cta-1), var(--cta-2))',
                                boxShadow: '0 8px 26px var(--brand-tint)',
                            }}
                        >
                            {/* Label wrapped in a <span>, not a bare text node — see the note
                                in auth/LoginPage.jsx: a loose text node beside an element is
                                what translation extensions rewrite, and the next re-render
                                then dies on removeChild. */}
                            {isLoading
                                ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                                : <><span>{isAr ? 'تسجيل الدخول' : 'Sign in'}</span> <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /></>}
                        </button>
                    </form>
                </div>

                <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    {isAr ? 'الصلاحية بتتحقق على السيرفر في كل طلب' : 'Authorisation is re-checked server-side on every request'}
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
