import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import './components/auth/LoginPage.css';
import {
  Sparkles,
  Globe,
  FolderOpen,
  Settings,
  Zap,
  ChevronRight,
  ChevronLeft,
  Flame,
  Wand2,
  LogOut,
  Crown,
  Sun,
  Moon,
  Home,
  Lock,
  DollarSign,
  Info,
  Mail,
  Briefcase,
  User,
  X
} from 'lucide-react';
import GeneratorSection from './components/generator/GeneratorSection';
import ExtractorSection from './components/extractor/ExtractorSection';
import TrendHunter from './components/trendhunter/TrendHunter';
import PromptArchitect from './components/promptarchitect/PromptArchitect';
import SecretVault from './components/secretvault/SecretVault';
import HomePage from './components/home/HomePage';
import CommandPalette from './components/ui/CommandPalette';
// Lazy-loaded components (must be at module scope, NOT inside render)
const LoginPage = React.lazy(() => import('./components/auth/LoginPage'));
const PricingPage = React.lazy(() => import('./components/pages/PricingPage'));
const AboutPage = React.lazy(() => import('./components/pages/AboutPage'));
const ServicesPage = React.lazy(() => import('./components/pages/ServicesPage'));
const ContactPage = React.lazy(() => import('./components/pages/ContactPage'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));
const AdminLoginPage = React.lazy(() => import('./components/admin/AdminLoginPage'));

// Compact Header Language Toggle
const HeaderLanguageToggle = () => {
  const { language, toggleLanguage, isRTL } = useAppContext();

  return (
    <button
      onClick={toggleLanguage}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full
        bg-surface border border-border transition-all duration-300 group
        hover:border-primary/50
        ${isRTL ? 'flex-row-reverse' : ''}
      `}
      style={{}}
    >
      <Globe className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
      <span className="text-xs font-medium text-text2 group-hover:text-text1">
        {language === 'en' ? 'English' : 'العربية'}
      </span>
    </button>
  );
};

// ═══════════════════════════════════════
// USER PROFILE MODAL
// ═══════════════════════════════════════
const UserProfileModal = ({ onClose }) => {
  const { isRTL, language } = useAppContext();
  const { user, signOut } = useAuth();
  const isAr = language === 'ar';
  const initial = (user?.display_name || user?.email || 'G')[0].toUpperCase();
  const displayName = user?.display_name || user?.email?.split('@')[0];

  const usageLimits = [
    { labelEn: 'Video Blueprints', labelAr: 'مخططات الفيديو', used: 3, max: 50, color: '#818cf8' },
    { labelEn: 'Prompt Extractions', labelAr: 'استخراج البرومبتات', used: 1, max: 30, color: '#38bdf8' },
    { labelEn: 'Trend Scans', labelAr: 'مسح الترندات', used: 0, max: 20, color: '#fb923c' },
    { labelEn: 'Prompt Architect', labelAr: 'مهندس البرومبت', used: 2, max: 50, color: '#c084fc' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm" onClick={onClose}
        style={{ animation: 'fadeIn 0.15s ease-out' }} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto w-[420px] max-w-[92vw] rounded-2xl overflow-hidden"
          style={{ animation: 'fadeIn 0.2s ease-out', background: 'rgba(15,15,25,0.97)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>

          {/* Header */}
          <div className="p-5 border-b border-white/5" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))' }}>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-500/30 ring-2 ring-white/10">
                  {initial}
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="text-base font-bold text-white">{displayName}</p>
                  <p className="text-xs text-zinc-400">{user?.email}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
            {/* Plan Badge */}
            <div className={`mt-3 ${isRTL ? 'text-right' : ''}`}>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border
                ${user?.plan === 'pro'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50'}
              `}>
                {user?.plan === 'pro' && <Crown className="w-3 h-3" />}
                {user?.plan === 'pro' ? 'PRO PLAN' : (isAr ? 'باقة مجانية' : 'FREE PLAN')}
              </span>
            </div>
          </div>

          {/* Usage Limits */}
          <div className="p-5">
            <h4 className={`text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 ${isRTL ? 'text-right' : ''}`}>
              {isAr ? 'حدود الاستخدام الشهرية' : 'Monthly Usage Limits'}
            </h4>
            <div className="space-y-3">
              {usageLimits.map((item, i) => {
                const pct = Math.round((item.used / item.max) * 100);
                return (
                  <div key={i}>
                    <div className={`flex items-center justify-between mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs text-zinc-300">{isAr ? item.labelAr : item.labelEn}</span>
                      <span className="text-[11px] font-mono text-zinc-500">{item.used}/{item.max}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sign Out */}
          <div className="p-4 border-t border-white/5">
            <button
              onClick={() => { signOut(); onClose(); }}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/20
                text-red-400 hover:text-red-300 transition-all duration-200 font-semibold text-sm
                ${isRTL ? 'flex-row-reverse' : ''}
              `}
            >
              <LogOut className="w-4 h-4" />
              <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Sidebar = ({ onNavClick }) => {
  const { activeTab, setActiveTab, t, isRTL, language, toggleLanguage } = useAppContext();
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('kemo-theme') || 'dark');
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kemo-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const navItems = [
    { id: 'home', labelKey: 'home', descKey: 'homeDesc', icon: Home, color: 'violet' },
    { id: 'generator', labelKey: 'generator', descKey: 'generatorDesc', icon: Sparkles, color: 'blue' },
    { id: 'extractor', labelKey: 'extractor', descKey: 'extractorDesc', icon: Globe, color: 'sky' },
    { id: 'trendhunter', labelKey: 'trendHunter', descKey: 'trendHunterDesc', icon: Flame, color: 'indigo' },
    { id: 'promptarchitect', labelKey: 'promptArchitect', descKey: 'promptArchitectDesc', icon: Wand2, color: 'violet' },
    { id: 'secretvault', labelKey: 'secretVault', descKey: 'secretVaultDesc', icon: Lock, color: 'amber' },
  ];

  const initial = user ? (user.display_name || user.email || 'G')[0].toUpperCase() : 'G';
  const displayName = user?.display_name || user?.email?.split('@')[0];

  return (
    <aside
      className={`flex flex-col transition-all duration-300 bg-bg1 border-l border-border ${collapsed ? 'w-[72px]' : 'w-60'}`}
    >
      {/* Logo */}
      <div className={`p-4 ${isRTL ? 'text-right' : ''}`}>
        <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <img
            src="/logo.jpg"
            alt="Kemo Engine"
            className="w-9 h-9 rounded-xl object-cover shadow-sm bg-surface"
          />
          {!collapsed && (
            <div className="fade-in">
              <h1 className="font-bold text-sm text-text1">
                <span className="text-primary font-extrabold">Kemo</span> Engine
              </h1>
              <p className="text-[10px] text-muted">{t('appSubtitle')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3">
        {!collapsed && (
          <p className={`sidebar-section-label px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider ${isRTL ? 'text-right' : ''}`} style={{ color: 'var(--text-muted)' }}>
            {t('menu')}
          </p>
        )}

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); onNavClick?.(); }}
              className={`
                w-full flex items-center gap-2 h-10 px-3 rounded-lg mb-1 transition-all
                ${isActive
                  ? 'bg-active-state text-primary font-medium'
                  : 'text-text2 hover:bg-hover-state hover:text-text1'
                }
                ${isRTL ? 'flex-row-reverse text-right' : ''}
                ${collapsed ? 'justify-center px-0' : ''}
              `}
              title={collapsed ? t(item.labelKey) : ''}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && (
                <>
                  <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className="font-medium text-sm">{t(item.labelKey)}</p>
                  </div>
                  {isActive && (
                    <ChevronRight className={`w-4 h-4 text-primary ${isRTL ? 'rotate-180' : ''}`} />
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile — Middle Section */}
      <div className="px-3 py-2">
        <div className="sidebar-divider mb-2 border-t border-border" />
        {user && !collapsed && (
          <button
            onClick={() => setShowUserModal(true)}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all cursor-pointer
              hover:bg-hover-state group
              ${isRTL ? 'flex-row-reverse' : ''}
            `}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
              {initial}
            </div>
            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-xs font-semibold text-text1 truncate">{displayName}</p>
              <p className="text-[10px] text-muted truncate">
                {user?.plan === 'pro' ? 'PRO' : 'FREE'}
              </p>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        )}
        {user && collapsed && (
          <button
            onClick={() => setShowUserModal(true)}
            className="w-full flex items-center justify-center py-2 rounded-lg hover:bg-hover-state transition-all cursor-pointer"
            title={displayName}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
              {initial}
            </div>
          </button>
        )}
        <div className="sidebar-divider mt-2 border-t border-border" />
      </div>

      {/* More Section */}
      <nav className="px-3">
        {!collapsed && (
          <p className={`sidebar-section-label px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider ${isRTL ? 'text-right' : ''}`} style={{ color: 'var(--text-muted)' }}>
            {t('more')}
          </p>
        )}

        <button className={`w-full sidebar-nav-item opacity-40 hover:opacity-70 ${isRTL ? 'flex-row-reverse' : ''} ${collapsed ? 'justify-center px-0' : ''}`}>
          <FolderOpen className="w-5 h-5" />
          {!collapsed && <span className="flex-1 text-sm">{t('assets')}</span>}
        </button>
        <button className={`w-full sidebar-nav-item opacity-40 hover:opacity-70 ${isRTL ? 'flex-row-reverse' : ''} ${collapsed ? 'justify-center px-0' : ''}`}>
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="flex-1 text-sm">{t('settings')}</span>}
        </button>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom section — Language, Theme, Version */}
      <div className="p-3 border-t border-border">
        {/* Language Toggle */}
        {!collapsed && (
          <button
            onClick={toggleLanguage}
            className={`w-full flex items-center gap-2 h-9 px-3 rounded-lg mb-2 transition-all
              text-text2 hover:bg-hover-state hover:text-text1
              ${isRTL ? 'flex-row-reverse' : ''}
            `}
          >
            <Globe className="w-4 h-4 text-muted" />
            <span className="flex-1 text-xs font-medium">{language === 'en' ? 'English' : 'العربية'}</span>
          </button>
        )}
        {collapsed && (
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center justify-center h-9 rounded-lg mb-2 text-text2 hover:bg-hover-state hover:text-text1 transition-all"
            title={language === 'en' ? 'العربية' : 'English'}
          >
            <Globe className="w-4 h-4" />
          </button>
        )}

        {/* Theme + Collapse */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={theme === 'dark' ? (isRTL ? 'الوضع الفاتح' : 'Light Mode') : (isRTL ? 'الوضع الداكن' : 'Dark Mode')}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex-1 sidebar-nav-item opacity-60 hover:opacity-100 justify-center"
          >
            {collapsed
              ? <ChevronRight className="w-4 h-4" />
              : <ChevronLeft className="w-4 h-4" />
            }
            {!collapsed && <span className="flex-1 text-xs">{isRTL ? 'تصغير' : 'Collapse'}</span>}
          </button>
        </div>

        {!collapsed && (
          <div className="sidebar-version flex items-center justify-center gap-2 py-2 mt-1">
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>v10.0</span>
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--border-light)' }} />
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Kemo Engine</span>
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      {showUserModal && <UserProfileModal onClose={() => setShowUserModal(false)} />}
    </aside>
  );
};

const Header = () => {
  const { activeTab, setActiveTab, t, isRTL, language } = useAppContext();
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const servicesRef = React.useRef(null);
  const isAr = language === 'ar';

  // Close services dropdown on outside click
  React.useEffect(() => {
    const handleClick = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setShowServicesMenu(false);
      }
    };
    if (showServicesMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showServicesMenu]);

  const serviceItems = [
    { id: 'generator', labelEn: 'AI Video Studio', labelAr: 'استوديو الفيديو', descEn: 'Generate complete video blueprints', descAr: 'إنشاء مخططات فيديو كاملة', icon: Sparkles, color: '#818cf8' },
    { id: 'extractor', labelEn: 'Prompt Extractor', labelAr: 'مستخرج البرومبتات', descEn: 'Reverse-engineer any content', descAr: 'هندسة عكسية لأي محتوى', icon: Globe, color: '#38bdf8' },
    { id: 'trendhunter', labelEn: 'Trend Hunter', labelAr: 'صائد الترندات', descEn: 'Discover viral content formulas', descAr: 'اكتشف صيغ المحتوى الفيروسي', icon: Flame, color: '#fb923c' },
    { id: 'promptarchitect', labelEn: 'Prompt Architect', labelAr: 'مهندس البرومبت', descEn: 'Build master system prompts', descAr: 'بناء برومبتات نظامية متقدمة', icon: Wand2, color: '#c084fc' },
    { id: 'secretvault', labelEn: 'Secret Vault', labelAr: 'المكتبة السرية', descEn: 'Curated elite AI prompts', descAr: 'مجموعة نخبوية من البرومبتات', icon: Lock, color: '#f59e0b' },
  ];

  const tabConfig = {
    home: { icon: Home },
    generator: { icon: Sparkles },
    extractor: { icon: Globe },
    trendhunter: { icon: Flame },
    promptarchitect: { icon: Wand2 },
    secretvault: { icon: Lock },
    services: { icon: Briefcase },
    pricing: { icon: DollarSign },
    about: { icon: Info },
    contact: { icon: Mail },
  };

  const config = tabConfig[activeTab] || tabConfig.home;
  const Icon = config.icon;

  const navLinks = [
    { id: 'services', labelKey: 'services', icon: Briefcase, hasDropdown: true },
    { id: 'pricing', labelKey: 'pricing', icon: DollarSign },
    { id: 'about', labelKey: 'about', icon: Info },
    { id: 'contact', labelKey: 'contact', icon: Mail },
  ];

  return (
    <header className={`header-bar ${isRTL ? 'text-right' : ''}`} style={{ padding: 0 }}>
      {/* Full-width SaaS navbar */}
      <div className="w-full flex items-center justify-center py-2.5 px-6"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
        <nav className={`flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {navLinks.map((link) => {
            const isActive = activeTab === link.id || (link.id === 'services' && showServicesMenu);
            const LinkIcon = link.icon;

            // Services button with dropdown
            if (link.hasDropdown) {
              return (
                <div key={link.id} className="relative" ref={servicesRef}>
                  <button
                    onClick={() => setShowServicesMenu(!showServicesMenu)}
                    className={`relative flex items-center gap-2 py-1 text-[13px] font-semibold transition-all duration-200
                      ${isRTL ? 'flex-row-reverse' : ''}
                    `}
                    style={{
                      color: isActive ? '#e4e4e7' : '#71717a',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#e4e4e7'; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = '#71717a'; }}
                  >
                    <LinkIcon className="w-[15px] h-[15px] opacity-70" />
                    <span>{t(link.labelKey)}</span>
                    <ChevronRight className={`w-3 h-3 opacity-50 transition-transform duration-200 ${showServicesMenu ? 'rotate-90' : ''} ${isRTL ? 'rotate-180' : ''} ${showServicesMenu && isRTL ? '-rotate-90' : ''}`} />
                    {/* Active underline */}
                    {isActive && (
                      <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] rounded-full"
                        style={{ background: 'linear-gradient(90deg, transparent, #6366f1, transparent)' }} />
                    )}
                  </button>

                  {/* Services Dropdown */}
                  {showServicesMenu && (
                    <div
                      className={`absolute top-full mt-3 w-80 z-[100] rounded-xl overflow-hidden
                        ${isRTL ? 'left-0' : 'right-0'}
                      `}
                      style={{
                        background: 'rgba(15,15,25,0.97)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
                        animation: 'fadeIn 0.15s ease-out',
                      }}
                    >
                      <div className={`px-4 py-3 border-b ${isRTL ? 'text-right' : ''}`} style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#6366f1' }}>
                          {isAr ? 'أدوات المنصة' : 'Platform Tools'}
                        </p>
                      </div>
                      <div className="p-2">
                        {serviceItems.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => { setActiveTab(item.id); setShowServicesMenu(false); }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group
                                ${isRTL ? 'flex-row-reverse text-right' : ''}
                              `}
                              onMouseEnter={(e) => { e.currentTarget.style.background = `${item.color}0a`; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            >
                              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                                style={{ background: `${item.color}12`, border: `1px solid ${item.color}20` }}>
                                <ItemIcon className="w-4 h-4" style={{ color: item.color }} />
                              </div>
                              <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                                <p className="text-[13px] font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                                  {isAr ? item.labelAr : item.labelEn}
                                </p>
                                <p className="text-[11px] text-zinc-500 group-hover:text-zinc-400 transition-colors truncate">
                                  {isAr ? item.descAr : item.descEn}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="px-3 py-2.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <button
                          onClick={() => { setActiveTab('services'); setShowServicesMenu(false); }}
                          className={`w-full flex items-center justify-center gap-1.5 text-[12px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          {isAr ? 'عرض جميع الخدمات' : 'View All Services'}
                          <ChevronRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // Normal nav links
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`relative flex items-center gap-2 py-1 text-[13px] font-semibold transition-all duration-200
                  ${isRTL ? 'flex-row-reverse' : ''}
                `}
                style={{
                  color: isActive ? '#e4e4e7' : '#71717a',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#e4e4e7'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = '#71717a'; }}
              >
                <LinkIcon className="w-[15px] h-[15px] opacity-70" />
                <span>{t(link.labelKey)}</span>
                {/* Active underline */}
                {isActive && (
                  <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] rounded-full"
                    style={{ background: 'linear-gradient(90deg, transparent, #6366f1, transparent)' }} />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

const MainContent = ({ onMenuClick }) => {
  const { activeTab } = useAppContext();

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomePage />;
      case 'generator': return <GeneratorSection />;
      case 'extractor': return <ExtractorSection />;
      case 'trendhunter': return <TrendHunter />;
      case 'promptarchitect': return <PromptArchitect />;
      case 'secretvault': return <SecretVault />;
      case 'pricing': return <React.Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}><PricingPage /></React.Suspense>;
      case 'about': return <React.Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}><AboutPage /></React.Suspense>;
      case 'services': return <React.Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}><ServicesPage /></React.Suspense>;
      case 'contact': return <React.Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}><ContactPage /></React.Suspense>;
      default: return <HomePage />;
    }
  };

  return (
    <main className="flex-1 flex flex-col h-screen relative z-10 overflow-hidden">
      {/* Header Area - Fixed at top */}
      <div className="flex-none z-50 relative">
        <div className="md:hidden absolute top-3 right-3 z-50">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg bg-surface text-text1 shadow-md hover:bg-hover-state transition-colors"
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <Header />
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 scroll-smooth">
        <div key={activeTab} style={{ animation: 'pageEnter 0.3s ease-out' }}>
          {renderContent()}
        </div>
      </div>
    </main>
  );
};

const AppLayout = () => {
  const { isRTL } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="relative min-h-screen bg-bg0 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <CommandPalette />
      <div className={`relative z-10 flex min-h-screen ${isRTL ? '' : 'flex-row-reverse'}`}>
        {/* Mobile backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
        {/* Sidebar — hidden on mobile unless mobileOpen */}
        <div className={`${mobileOpen ? 'fixed inset-y-0 right-0 z-50' : 'hidden'
          } md:relative md:block`}>
          <Sidebar onNavClick={() => setMobileOpen(false)} />
        </div>
        <MainContent onMenuClick={() => setMobileOpen(true)} />
      </div>
    </div>
  );
};

// Auth-aware root — shows login when user not logged in
const AuthGate = () => {
  const { user, loading } = useAuth();
  const isAdminRoute = window.location.pathname.toLowerCase().startsWith('/admin');

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg0">
        <div className="text-center">
          <img src="/logo.jpg" alt="Kemo Engine" className="w-16 h-16 rounded-2xl mx-auto mb-4 animate-pulse" />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  // /admin route — separate flow
  if (isAdminRoute) {
    if (!user) {
      return (
        <React.Suspense fallback={<div className="min-h-screen bg-[#0a0a1a]" />}>
          <AdminLoginPage />
        </React.Suspense>
      );
    }
    // Logged in → show full-page admin dashboard (handles its own access control)
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-[#0a0a1a]" />}>
        <AdminDashboard />
      </React.Suspense>
    );
  }

  // Normal route — no user → show login page
  if (!user) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-bg0" />}>
        <LoginPage />
      </React.Suspense>
    );
  }

  // User exists → show app
  return <AppLayout />;
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <ToastProvider>
          <AuthGate />
        </ToastProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
