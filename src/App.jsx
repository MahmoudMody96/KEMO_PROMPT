import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import {
  Sparkles,
  Globe,
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
  X
} from 'lucide-react';
import HomePage from './components/home/HomePage';
import CommandPalette from './components/ui/CommandPalette';
import Wordmark, { WordmarkMark } from './components/ui/Wordmark';
import { PLANS } from './services/creditsService';
import { useModal } from './lib/useModal';
import { lazyWithRetry } from './lib/lazyWithRetry';
import { isPublicTab } from './lib/routes';
import ErrorBoundary from './components/ErrorBoundary';
import PublicLayout from './components/layout/PublicLayout';

// Lazy-loaded components (must be at module scope, NOT inside render)
//
// The five tool surfaces below pull in the whole prompt-engine layer — roughly
// 145 KB gzip of static DNA data. They used to be static imports while the
// small marketing pages were the lazy ones, so every visitor downloaded the
// entire engine before the login screen rendered. Lazy here means the engines
// only load once someone actually opens a tool.
//
// lazyWithRetry, not React.lazy: a chunk can go missing for reasons unrelated
// to the code — a dev server restart, or a deploy that renamed the hashed files
// while this tab stayed open. Plain React.lazy turns that into a render throw
// and the ErrorBoundary shows "Application Crashed", which is an alarming
// dead end for something a single reload fixes.
const GeneratorSection = lazyWithRetry(() => import('./components/generator/GeneratorSection'), 'GeneratorSection');
const ExtractorSection = lazyWithRetry(() => import('./components/extractor/ExtractorSection'), 'ExtractorSection');
const TrendHunter = lazyWithRetry(() => import('./components/trendhunter/TrendHunter'), 'TrendHunter');
const PromptArchitect = lazyWithRetry(() => import('./components/promptarchitect/PromptArchitect'), 'PromptArchitect');
const SecretVault = lazyWithRetry(() => import('./components/secretvault/SecretVault'), 'SecretVault');

const LoginPage = lazyWithRetry(() => import('./components/auth/LoginPage'), 'LoginPage');
const PricingPage = lazyWithRetry(() => import('./components/pages/PricingPage'), 'PricingPage');
const AboutPage = lazyWithRetry(() => import('./components/pages/AboutPage'), 'AboutPage');
const ServicesPage = lazyWithRetry(() => import('./components/pages/ServicesPage'), 'ServicesPage');
const ContactPage = lazyWithRetry(() => import('./components/pages/ContactPage'), 'ContactPage');
const AdminDashboard = lazyWithRetry(() => import('./components/admin/AdminDashboard'), 'AdminDashboard');
const AdminLoginPage = lazyWithRetry(() => import('./components/admin/AdminLoginPage'), 'AdminLoginPage');

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
  const { isRTL, language, setActiveTab } = useAppContext();
  const { user, signOut, credits, plan, profileLoading } = useAuth();
  const isAr = language === 'ar';
  // This modal previously could not be dismissed from the keyboard at all.
  const dialogRef = useModal(true, onClose);
  const initial = (user?.display_name || user?.email || 'G')[0].toUpperCase();
  const displayName = user?.display_name || user?.email?.split('@')[0];

  const planLabel = PLANS[plan]?.[isAr ? 'name_ar' : 'name'] || plan;
  const monthlyCredits = PLANS[plan]?.credits_monthly ?? null;
  const creditsUsed = user?.credits_used ?? 0;

  // credits === null means "not loaded / unknown" — never render it as unlimited.
  const creditsKnown = typeof credits === 'number';
  const usagePct = creditsKnown && monthlyCredits
    ? Math.min(100, Math.round(((monthlyCredits - credits) / monthlyCredits) * 100))
    : 0;

  return (
    <>
      <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm" onClick={onClose}
        style={{ animation: 'fadeIn 0.15s ease-out' }} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={isAr ? 'حسابي' : 'My account'}
          className="pointer-events-auto w-[420px] max-w-[92vw] rounded-2xl overflow-hidden"
          style={{ animation: 'fadeIn 0.2s ease-out', background: 'var(--modal-bg)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: 'var(--dropdown-shadow)' }}>

          {/* Header */}
          <div className="p-5 border-b border-white/5" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))' }}>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-500/30 ring-2 ring-white/10">
                  {initial}
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="text-base font-bold text-white">{displayName}</p>
                  <p className="text-xs text-text2">{user?.email}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <X className="w-4 h-4 text-text2" />
              </button>
            </div>
            {/* Plan Badge */}
            <div className={`mt-3 ${isRTL ? 'text-right' : ''}`}>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border
                ${plan !== 'free'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-zinc-800/50 text-text2 border-zinc-700/50'}
              `}>
                {plan !== 'free' && <Crown className="w-3 h-3" />}
                {planLabel}
              </span>
            </div>
          </div>

          {/* Credit balance */}
          <div className="p-5">
            <h4 className={`text-xs font-bold text-text2 uppercase tracking-wider mb-3 ${isRTL ? 'text-right' : ''}`}>
              {isAr ? 'الرصيد' : 'Credits'}
            </h4>

            {profileLoading && (
              <p className="text-xs text-muted">{isAr ? 'جارِ التحميل…' : 'Loading…'}</p>
            )}

            {!profileLoading && !creditsKnown && (
              <p className="text-xs text-muted">
                {isAr ? 'الرصيد غير متاح حالياً' : 'Balance unavailable right now'}
              </p>
            )}

            {!profileLoading && creditsKnown && (
              <>
                <div className={`flex items-end justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-2xl font-bold text-white tabular-nums">{credits}</span>
                  <span className="text-[11px] text-muted">
                    {isAr ? `مستهلك: ${creditsUsed}` : `${creditsUsed} used`}
                  </span>
                </div>
                {monthlyCredits ? (
                  <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${usagePct}%`, backgroundColor: '#818cf8' }}
                    />
                  </div>
                ) : null}
              </>
            )}

            <button
              onClick={() => { setActiveTab('pricing'); onClose(); }}
              className="mt-4 w-full px-4 py-2 rounded-xl text-sm font-semibold
                bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20
                text-indigo-300 hover:text-indigo-200 transition-all duration-200"
            >
              {isAr ? 'شحن الرصيد' : 'Get more credits'}
            </button>
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
  // Theme comes from AppContext now: it has to be readable by the public
  // landing page and the login screen, neither of which mounts this component.
  const { activeTab, setActiveTab, t, isRTL, language, toggleLanguage, theme, toggleTheme } = useAppContext();
  const { user, plan, credits } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // No per-item accent colour any more. Colour was being used to separate seven
  // siblings of equal importance, which only made the rail noisy — the active
  // state alone carries the distinction now.
  const navItems = [
    { id: 'home', labelKey: 'home', icon: Home },
    { id: 'generator', labelKey: 'generator', icon: Sparkles },
    { id: 'extractor', labelKey: 'extractor', icon: Globe },
    { id: 'trendhunter', labelKey: 'trendHunter', icon: Flame },
    { id: 'promptarchitect', labelKey: 'promptArchitect', icon: Wand2 },
    { id: 'secretvault', labelKey: 'secretVault', icon: Lock },
  ];

  const initial = user ? (user.display_name || user.email || 'G')[0].toUpperCase() : 'G';
  const displayName = user?.display_name || user?.email?.split('@')[0];
  const planLabel = (PLANS[plan]?.name || plan || '').toUpperCase();
  const creditsKnown = typeof credits === 'number';
  const monthlyCredits = PLANS[plan]?.credits_monthly || 20;

  // h-full, not auto: the wrapper around this aside is display:block, so a
  // block-level child sizes to its own content instead of inheriting the
  // wrapper's height. The rail stopped at roughly 528px of a 910px viewport —
  // the background and border simply ended partway down the screen.
  return (
    <aside
      className={`relative flex h-full flex-col bg-bg1 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${collapsed ? 'w-[76px]' : 'w-[248px]'}`}
      style={{ borderInlineEnd: '1px solid var(--border-color)' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5">
        <WordmarkMark size={36} />
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate leading-tight">
              <Wordmark size="sm" />
            </p>
            <p className="truncate text-[10px] text-muted">{t('appSubtitle')}</p>
          </div>
        )}
      </div>

      {/* Primary navigation */}
      <nav className="px-3" aria-label={isRTL ? 'التنقل الرئيسي' : 'Main navigation'}>
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
            {t('menu')}
          </p>
        )}

        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => { setActiveTab(item.id); onNavClick?.(); }}
                  title={collapsed ? t(item.labelKey) : undefined}
                  className={`focus-ring group relative flex h-10 w-full items-center gap-3 rounded-xl text-sm transition-colors duration-200
                    ${collapsed ? 'justify-center px-0' : 'px-3'}
                    ${isActive ? 'font-semibold text-text1' : 'font-medium text-text2 hover:bg-hover-state hover:text-text1'}`}
                  style={isActive ? { background: 'var(--brand-tint)' } : undefined}
                >
                  {/* Active rail: a 3px bar on the inline-start edge reads as
                      "you are here" faster than a colour swap, and it flips
                      sides automatically in RTL. */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full"
                      style={{
                        insetInlineStart: 0,
                        background: 'linear-gradient(var(--brand-1), var(--brand-3))',
                      }}
                    />
                  )}
                  <item.icon
                    className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={isActive ? { color: 'var(--brand-fg)' } : undefined}
                    aria-hidden="true"
                  />
                  {!collapsed && <span className="truncate">{t(item.labelKey)}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex-1" />

      {/* Account + balance.
          Credits are what users actually run out of, so the balance gets a real
          meter instead of being buried as a number in a subtitle. */}
      <div className="px-3 pb-3">
        {user && (
          <button
            onClick={() => setShowUserModal(true)}
            title={collapsed ? displayName : undefined}
            className={`focus-ring w-full rounded-2xl border border-border p-3 text-start transition-colors hover:border-[var(--brand-border-strong)] ${collapsed ? 'flex justify-center' : ''}`}
            style={{ background: 'var(--overlay-3)' }}
          >
            <div className={`flex items-center gap-3 ${collapsed ? '' : 'w-full'}`}>
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold on-brand text-white"
                style={{ background: 'linear-gradient(135deg, var(--cta-1), var(--cta-2))' }}
              >
                {initial}
              </span>
              {!collapsed && (
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-text1">{displayName}</span>
                  <span className="block truncate text-[10px] text-muted">{planLabel}</span>
                </span>
              )}
            </div>

            {!collapsed && creditsKnown && (
              <div className="mt-3">
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-[10px] uppercase tracking-wide text-muted">
                    {isRTL ? 'الرصيد' : 'Credits'}
                  </span>
                  <span className="text-xs font-bold tabular-nums text-text1">{credits}</span>
                </div>
                <div
                  className="h-1.5 overflow-hidden rounded-full"
                  style={{ background: 'var(--overlay-8)' }}
                  role="progressbar"
                  aria-valuenow={credits}
                  aria-valuemin={0}
                  aria-valuemax={monthlyCredits}
                  aria-label={isRTL ? 'الرصيد المتبقي' : 'Credits remaining'}
                >
                  <div
                    className="h-full rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      width: `${Math.min(100, Math.max(4, (credits / monthlyCredits) * 100))}%`,
                      background: 'linear-gradient(90deg, var(--brand-1), var(--brand-3))',
                    }}
                  />
                </div>
              </div>
            )}
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="px-3 pb-4 pt-3" style={{ borderBlockStart: '1px solid var(--border-color)' }}>
        <div className={`flex items-center gap-1.5 ${collapsed ? 'flex-col' : ''}`}>
          <button
            onClick={toggleLanguage}
            title={language === 'en' ? 'العربية' : 'English'}
            aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            className="focus-ring flex h-9 flex-1 items-center justify-center gap-2 rounded-lg text-text2 transition-colors hover:bg-hover-state hover:text-text1"
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            {!collapsed && <span className="text-xs font-medium">{language === 'en' ? 'EN' : 'ع'}</span>}
          </button>

          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? (isRTL ? 'الوضع الفاتح' : 'Light mode') : (isRTL ? 'الوضع الداكن' : 'Dark mode')}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-lg text-text2 transition-colors hover:bg-hover-state hover:text-text1"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-lg text-text2 transition-colors hover:bg-hover-state hover:text-text1"
          >
            {/* rtl:rotate-180 instead of a hardcoded direction check, so the
                arrow always points the way the panel will actually move. */}
            <ChevronLeft className={`h-4 w-4 transition-transform duration-300 rtl:rotate-180 ${collapsed ? 'rotate-180 rtl:rotate-0' : ''}`} />
          </button>
        </div>
      </div>

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
          background: 'linear-gradient(180deg, var(--overlay-2) 0%, transparent 100%)',
          borderBottom: '1px solid var(--border-color)',
        }}>
        <nav className={`hidden md:flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                      color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'; }}
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
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--dropdown-shadow)',
                        animation: 'fadeIn 0.15s ease-out',
                      }}
                    >
                      <div className={`px-4 py-3 border-b ${isRTL ? 'text-right' : ''}`} style={{ borderColor: 'var(--border-color)' }}>
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
                                <p className="text-[13px] font-semibold text-text1 group-hover:text-white transition-colors truncate">
                                  {isAr ? item.labelAr : item.labelEn}
                                </p>
                                <p className="text-[11px] text-muted group-hover:text-text2 transition-colors truncate">
                                  {isAr ? item.descAr : item.descEn}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="px-3 py-2.5 border-t" style={{ borderColor: 'var(--border-color)' }}>
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
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'; }}
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

// Shown for a path that matches no tab. Previously an unknown URL silently
// rendered the homepage, so a typo was indistinguishable from /.
const NotFoundPage = () => {
  const { isRTL, navigate } = useAppContext();
  return (
    <div className="w-full max-w-xl mx-auto text-center py-20">
      <p className="text-6xl mb-4">🧭</p>
      <h1 className="text-2xl font-bold text-text1 mb-2">
        {isRTL ? 'الصفحة دي مش موجودة' : 'This page does not exist'}
      </h1>
      <p className="text-sm text-muted mb-6">
        {isRTL
          ? 'يمكن الرابط اتغيّر أو فيه حرف ناقص.'
          : 'The link may have changed, or there is a typo in it.'}
      </p>
      <button
        onClick={() => navigate('home')}
        className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
      >
        {isRTL ? 'رجوع للرئيسية' : 'Back to home'}
      </button>
    </div>
  );
};

const MainContent = ({ onMenuClick }) => {
  const { activeTab, notFound } = useAppContext();

  // Every branch below is lazy now, so one Suspense wraps them all rather than
  // repeating an identical inline boundary per case.
  const renderContent = () => {
    if (notFound) return <NotFoundPage />;
    switch (activeTab) {
      case 'home': return <HomePage />;
      case 'generator': return <GeneratorSection />;
      case 'extractor': return <ExtractorSection />;
      case 'trendhunter': return <TrendHunter />;
      case 'promptarchitect': return <PromptArchitect />;
      case 'secretvault': return <SecretVault />;
      case 'pricing': return <PricingPage />;
      case 'about': return <AboutPage />;
      case 'services': return <ServicesPage />;
      case 'contact': return <ContactPage />;
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
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-4 scroll-smooth">
        {/* Keyed on activeTab so a crashed tab resets when you navigate away.
            Without this inner boundary, a render error in any single tool
            replaced the entire application — sidebar, header and all — and the
            only recovery was a full page reload. */}
        <div key={activeTab} style={{ animation: 'pageEnter 0.3s ease-out' }}>
          <ErrorBoundary key={activeTab}>
            <React.Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              {renderContent()}
            </React.Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </main>
  );
};

const AppLayout = () => {
  const { isRTL, updateGeneratorInput, setActiveTab } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Pick up an idea typed on the public landing page before signing in.
  //
  // Without this the landing quietly loses what the visitor wrote the moment
  // they hit the login form — they come back and the field is empty, which
  // makes the whole "type your idea" entry point feel like a bait and switch.
  // Runs once: the key is cleared immediately so a later reload does not
  // re-navigate the user into the generator unexpectedly.
  React.useEffect(() => {
    let pending = null;
    try {
      pending = sessionStorage.getItem('kemo-pending-idea');
      if (pending) sessionStorage.removeItem('kemo-pending-idea');
    } catch { /* storage unavailable — nothing to restore */ }

    if (pending) {
      updateGeneratorInput('coreIdea', pending);
      setActiveTab('generator');
    }
  }, [updateGeneratorInput, setActiveTab]);

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
        <div className={`${mobileOpen ? 'fixed inset-y-0 right-0 z-50 w-64' : 'hidden'
          } md:relative md:block md:w-auto`}>
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
  const { activeTab, theme, toggleTheme } = useAppContext();
  const isAdminRoute = window.location.pathname.toLowerCase().startsWith('/admin');

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg0">
        <div className="text-center">
          <div className="mb-4 animate-pulse">
            <Wordmark size="lg" withMark />
          </div>
          <p className="text-text2">Loading...</p>
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

  // Signed out.
  //
  // This used to return the login form for every route, so a first-time
  // visitor had to create an account before seeing what the product does. Now
  // the public routes render inside PublicLayout, and only /login shows the
  // form. Anything that spends credits still requires an account — the tool
  // cards on the landing page route here instead of opening.
  if (!user) {
    if (activeTab === 'login' || !isPublicTab(activeTab)) {
      return (
        <React.Suspense fallback={<div className="min-h-screen bg-bg0" />}>
          <LoginPage />
        </React.Suspense>
      );
    }
    return (
      <PublicLayout theme={theme} onToggleTheme={toggleTheme}>
        <ErrorBoundary key={activeTab}>
          <React.Suspense fallback={
            <div className="flex items-center justify-center py-24">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          }>
            {activeTab === 'pricing' ? <PricingPage />
              : activeTab === 'about' ? <AboutPage />
                : activeTab === 'services' ? <ServicesPage />
                  : activeTab === 'contact' ? <ContactPage />
                    : <HomePage />}
          </React.Suspense>
        </ErrorBoundary>
      </PublicLayout>
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
