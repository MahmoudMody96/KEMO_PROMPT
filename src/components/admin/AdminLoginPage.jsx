// src/components/admin/AdminLoginPage.jsx — Admin-only Login
// Dark corporate theme, email+password only, validates admin access
// Bilingual: Arabic + English

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Lock, ArrowRight, Loader2, ShieldCheck, AlertTriangle, Globe } from 'lucide-react';
import './AdminLoginPage.css';

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

const t = {
    en: {
        title: 'Admin Console',
        subtitle: 'Authorized Personnel Only',
        email: 'Admin Email',
        password: 'Password',
        signIn: 'Sign In',
        accessDenied: 'Access denied — this account is not authorized as an administrator.',
        authNotConfigured: 'Authentication system is not configured.',
        securedAccess: 'Secured Admin Access',
        backToSite: '← Back to Kemo Engine',
    },
    ar: {
        title: 'لوحة تحكم الأدمن',
        subtitle: 'للمسؤولين فقط',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        signIn: 'تسجيل الدخول',
        accessDenied: 'تم الرفض — هذا الحساب غير مصرح له كمسؤول.',
        authNotConfigured: 'نظام المصادقة غير مُفعّل.',
        securedAccess: 'وصول آمن للمسؤولين',
        backToSite: '→ العودة إلى Kemo Engine',
    },
};

const AdminLoginPage = () => {
    const { signIn, isAuthEnabled } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [lang, setLang] = useState('ar');
    const tx = t[lang];
    const isRTL = lang === 'ar';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
            setError(tx.accessDenied);
            return;
        }

        if (!isAuthEnabled) {
            setError(tx.authNotConfigured);
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn(email, password);
            if (result?.error) {
                setError(result.error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-container" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Language Toggle */}
                <button
                    onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                    className="admin-lang-toggle"
                    title={lang === 'ar' ? 'English' : 'العربية'}
                >
                    <Globe style={{ width: 14, height: 14 }} />
                    <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
                </button>

                {/* Shield Icon */}
                <div className="admin-login-shield">
                    <Shield />
                </div>

                <h1 className="admin-login-title">{tx.title}</h1>
                <p className="admin-login-subtitle">{tx.subtitle}</p>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="admin-login-field">
                        <Mail className="admin-login-field-icon" style={isRTL ? { right: 'auto', left: 14 } : {}} />
                        <input
                            type="email"
                            placeholder={tx.email}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="admin-login-input"
                            style={isRTL ? { paddingRight: 16, paddingLeft: 44 } : {}}
                            autoComplete="email"
                        />
                    </div>

                    <div className="admin-login-field">
                        <Lock className="admin-login-field-icon" style={isRTL ? { right: 'auto', left: 14 } : {}} />
                        <input
                            type="password"
                            placeholder={tx.password}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="admin-login-input"
                            style={isRTL ? { paddingRight: 16, paddingLeft: 44 } : {}}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="admin-login-error">
                            <AlertTriangle style={{ width: 14, height: 14, display: 'inline', marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0, verticalAlign: 'middle' }} />
                            {error}
                        </div>
                    )}

                    <button type="submit" className="admin-login-btn" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>{tx.signIn}</span>
                                <ArrowRight className="w-4 h-4" style={isRTL ? { transform: 'rotate(180deg)' } : {}} />
                            </>
                        )}
                    </button>
                </form>

                {/* Security Badge */}
                <div className="admin-security-badge">
                    <ShieldCheck />
                    <span>{tx.securedAccess}</span>
                </div>

                {/* Back to site */}
                <div className="admin-login-footer">
                    <a href="/">{tx.backToSite}</a>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
