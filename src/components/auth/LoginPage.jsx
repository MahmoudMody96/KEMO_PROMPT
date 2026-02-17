// src/components/auth/LoginPage.jsx — Authentication Page
// Modern, premium login/signup interface with RTL support

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Chrome, ArrowRight, Loader2, UserX } from 'lucide-react';

const LoginPage = () => {
    const { signIn, signUp, signInWithGoogle, error } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage('');

        try {
            if (isSignUp) {
                const result = await signUp(email, password, displayName);
                if (!result.error) {
                    setSuccessMessage('✅ تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتفعيل الحساب.');
                }
            } else {
                await signIn(email, password);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        await signInWithGoogle();
        setIsLoading(false);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Logo & Title */}
                <div className="login-header">
                    <div className="login-logo">
                        <img src="/logo.jpg" alt="Kemo Engine" className="w-full h-full rounded-[18px] object-cover" />
                    </div>
                    <h1 className="login-title">Kemo Engine</h1>
                    <p className="login-subtitle">
                        {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول لحسابك'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {isSignUp && (
                        <div className="login-field">
                            <User className="login-field-icon" />
                            <input
                                type="text"
                                placeholder="الاسم"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required
                                className="login-input"
                            />
                        </div>
                    )}

                    <div className="login-field">
                        <Mail className="login-field-icon" />
                        <input
                            type="email"
                            placeholder="البريد الإلكتروني"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="login-input"
                        />
                    </div>

                    <div className="login-field">
                        <Lock className="login-field-icon" />
                        <input
                            type="password"
                            placeholder="كلمة المرور"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="login-input"
                        />
                    </div>

                    {/* Error/Success Messages */}
                    {error && <div className="login-error">{error}</div>}
                    {successMessage && <div className="login-success">{successMessage}</div>}

                    {/* Submit Button */}
                    <button type="submit" className="login-btn-primary" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>{isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول'}</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="login-divider">
                        <span>أو</span>
                    </div>

                    {/* Google Sign In */}
                    <button type="button" onClick={handleGoogleLogin} className="login-btn-google" disabled={isLoading}>
                        <Chrome className="w-5 h-5" />
                        <span>تسجيل الدخول بـ Google</span>
                    </button>


                </form>

                {/* Toggle Sign Up / Sign In */}
                <div className="login-toggle">
                    <span>{isSignUp ? 'عندك حساب؟' : 'مش عندك حساب؟'}</span>
                    <button onClick={() => { setIsSignUp(!isSignUp); setSuccessMessage(''); }} className="login-toggle-btn">
                        {isSignUp ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
