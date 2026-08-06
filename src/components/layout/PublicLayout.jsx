// src/components/layout/PublicLayout.jsx — shell for signed-out visitors.
//
// The app used to answer every URL with the login form, so nobody could see
// what the product did before creating an account. Anonymous visitors now get
// the landing page inside this shell: a slim marketing header rather than the
// full app sidebar, because a sidebar full of tools that all bounce to the
// login form is a menu of dead ends.

import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Globe, Sun, Moon } from 'lucide-react';
import Wordmark from '../ui/Wordmark';

const PublicLayout = ({ children, theme, onToggleTheme }) => {
    const { isRTL, language, toggleLanguage, setActiveTab, activeTab } = useAppContext();

    const links = [
        { id: 'pricing', en: 'Pricing', ar: 'الأسعار' },
        { id: 'services', en: 'Services', ar: 'الخدمات' },
        { id: 'about', en: 'About', ar: 'عنّا' },
        { id: 'contact', en: 'Contact', ar: 'تواصل' },
    ];

    return (
        <div className="min-h-screen bg-bg0">
            {/* Sticky so the sign-in action stays reachable through a long page. */}
            <header
                className="surface-glass sticky top-0 z-50"
                style={{ borderBlockEnd: '1px solid var(--border-color)' }}
            >
                <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
                    <button
                        onClick={() => setActiveTab('home')}
                        className="focus-ring flex items-center gap-2.5 rounded-lg"
                        aria-label={isRTL ? 'الصفحة الرئيسية' : 'Home'}
                    >
                        <Wordmark size="md" />
                    </button>

                    <nav className="ms-auto hidden items-center gap-1 md:flex" aria-label={isRTL ? 'روابط' : 'Site'}>
                        {links.map((l) => (
                            <button
                                key={l.id}
                                onClick={() => setActiveTab(l.id)}
                                aria-current={activeTab === l.id ? 'page' : undefined}
                                className={`focus-ring rounded-lg px-3 py-2 text-sm transition-colors hover:text-text1 ${activeTab === l.id ? 'font-semibold text-text1' : 'text-text2'}`}
                            >
                                {isRTL ? l.ar : l.en}
                            </button>
                        ))}
                    </nav>

                    <div className="ms-auto flex items-center gap-1 md:ms-2">
                        <button
                            onClick={toggleLanguage}
                            className="focus-ring touch-target grid h-9 w-9 place-items-center rounded-lg text-text2 transition-colors hover:bg-hover-state hover:text-text1"
                            aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                            title={language === 'en' ? 'العربية' : 'English'}
                        >
                            <Globe className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                            onClick={onToggleTheme}
                            className="focus-ring touch-target grid h-9 w-9 place-items-center rounded-lg text-text2 transition-colors hover:bg-hover-state hover:text-text1"
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('login')}
                            className="press focus-ring touch-target ms-1 rounded-lg px-4 py-2 text-sm font-semibold on-brand text-white transition-opacity hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg, var(--cta-1), var(--cta-2))' }}
                        >
                            {isRTL ? 'دخول' : 'Sign in'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="px-4 pt-8">{children}</main>

            <footer className="mt-16 px-4 py-8" style={{ borderBlockStart: '1px solid var(--border-color)' }}>
                <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row">
                    <span>© {new Date().getFullYear()} Kemo Prompt</span>
                    <nav className="flex flex-wrap items-center justify-center gap-4" aria-label={isRTL ? 'روابط الأسفل' : 'Footer'}>
                        {links.map((l) => (
                            <button
                                key={l.id}
                                onClick={() => setActiveTab(l.id)}
                                className="focus-ring rounded transition-colors hover:text-text1"
                            >
                                {isRTL ? l.ar : l.en}
                            </button>
                        ))}
                    </nav>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
