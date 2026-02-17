// src/components/admin/AdminLoginPage.jsx — Admin-only Login
// Dark corporate theme, email+password only, validates admin access

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Lock, ArrowRight, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import './AdminLoginPage.css';

const ADMIN_EMAILS = ['mahmoud.abdelmonem1710@gmail.com'];

const AdminLoginPage = () => {
    const { signIn, isAuthEnabled } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check admin email before even trying
        if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
            setError('Access denied — this account is not authorized as an administrator.');
            return;
        }

        if (!isAuthEnabled) {
            setError('Authentication system is not configured.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn(email, password);
            if (result?.error) {
                setError(result.error);
            }
            // If success, AuthGate will handle the redirect
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                {/* Shield Icon */}
                <div className="admin-login-shield">
                    <Shield />
                </div>

                <h1 className="admin-login-title">Admin Console</h1>
                <p className="admin-login-subtitle">Authorized Personnel Only</p>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="admin-login-field">
                        <Mail className="admin-login-field-icon" />
                        <input
                            type="email"
                            placeholder="Admin Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="admin-login-input"
                            autoComplete="email"
                        />
                    </div>

                    <div className="admin-login-field">
                        <Lock className="admin-login-field-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="admin-login-input"
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="admin-login-error">
                            <AlertTriangle style={{ width: 14, height: 14, display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                            {error}
                        </div>
                    )}

                    <button type="submit" className="admin-login-btn" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Security Badge */}
                <div className="admin-security-badge">
                    <ShieldCheck />
                    <span>Secured Admin Access</span>
                </div>

                {/* Back to site */}
                <div className="admin-login-footer">
                    <a href="/">← Back to Kemo Engine</a>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
