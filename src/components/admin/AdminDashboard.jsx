// src/components/admin/AdminDashboard.jsx — Professional Admin Dashboard
// Bilingual: Arabic + English with language toggle

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { admin as adminApi } from '../../lib/apiClient';
import {
    Users, BarChart3, CreditCard, Activity,
    TrendingUp, Clock, Shield, RefreshCw,
    Search, ChevronDown, ChevronUp, Zap,
    UserCheck, Crown, AlertTriangle,
    Settings, LogOut, Home, Eye,
    Filter, Globe,
    CheckCircle, XCircle, ArrowUpRight,
    Database, Server, Wifi
} from 'lucide-react';

// Admin status comes from profiles.is_admin, enforced by RLS in the database.
// This helper only decides what to RENDER — it is not a security boundary:
// a non-admin who forces this to true still sees nothing, because every query
// they make is filtered by the same flag server-side.
export const isAdmin = (user) => user?.is_admin === true;

// ═══════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════
const translations = {
    en: {
        adminPanel: 'Admin Panel',
        kemoEngine: 'Kemo Engine',
        overview: 'Overview',
        users: 'Users',
        analytics: 'Analytics',
        settings: 'Settings',
        activityLog: 'Activity Log',
        site: 'Site',
        logout: 'Logout',
        refresh: 'Refresh',
        platformPerformance: 'Platform performance at a glance',
        registeredUsers: 'registered users',
        usagePatterns: 'Usage patterns & trends',
        siteConfig: 'Site configuration',
        lastActions: 'Last actions',
        totalUsers: 'Total Users',
        activeToday: 'Active Today',
        creditsUsed: 'Credits Used',
        totalGenerations: 'Total Generations',
        usageByAction: 'Usage by Action Type',
        generate: 'Generate',
        brainstorm: 'Brainstorm',
        extract: 'Extract',
        trendSearch: 'Trend Search',
        ofTotal: 'of total',
        planDistribution: 'Plan Distribution',
        free: 'Free',
        pro: 'Pro',
        enterprise: 'Enterprise',
        recentSignups: 'Recent Signups',
        latestActivity: 'Latest Activity',
        viewAll: 'View all',
        noActivity: 'No activity yet',
        searchPlaceholder: 'Search by name or email...',
        user: 'User',
        plan: 'Plan',
        credits: 'Credits',
        used: 'Used',
        joined: 'Joined',
        noUsers: 'No users found',
        save: 'Save',
        topUsersByUsage: 'Top Users by Usage',
        creditOverview: 'Credit Overview',
        totalDistributed: 'Total Credits Distributed',
        remaining: 'Remaining',
        consumed: 'Consumed',
        consumptionRate: 'Consumption Rate',
        requestStatus: 'Request Status',
        successful: 'Successful',
        failed: 'Failed',
        totalRequests: 'Total Requests',
        successRate: 'Success Rate',
        noData: 'No data yet',
        generalSettings: 'General Settings',
        defaultCreditsSignup: 'Default Credits on Signup',
        creditsForNewUsers: 'Credits given to new users',
        maxRequestsMin: 'Max Requests/Minute',
        rateLimitPerUser: 'Rate limit per user',
        featureToggles: 'Feature Toggles',
        maintenanceMode: 'Maintenance Mode',
        maintenanceDesc: 'Show maintenance page to all users',
        signupEnabled: 'Signup Enabled',
        signupDesc: 'Allow new user registrations',
        systemStatus: 'System Status',
        online: 'Online',
        offline: 'Offline',
        aiProvider: 'AI Provider',
        checking: 'Checking…',
        all: 'All',
        trends: 'Trends',
        actions: 'actions',
        accessDenied: 'Access Denied',
        adminOnly: 'This page is for administrators only',
        backToSite: '← Back to site',
    },
    ar: {
        adminPanel: 'لوحة التحكم',
        kemoEngine: 'Kemo Engine',
        overview: 'نظرة عامة',
        users: 'المستخدمين',
        analytics: 'التحليلات',
        settings: 'الإعدادات',
        activityLog: 'سجل النشاط',
        site: 'الموقع',
        logout: 'خروج',
        refresh: 'تحديث',
        platformPerformance: 'أداء المنصة بنظرة سريعة',
        registeredUsers: 'مستخدم مسجل',
        usagePatterns: 'أنماط الاستخدام والاتجاهات',
        siteConfig: 'إعدادات الموقع',
        lastActions: 'آخر الإجراءات',
        totalUsers: 'إجمالي المستخدمين',
        activeToday: 'نشط اليوم',
        creditsUsed: 'الرصيد المستهلك',
        totalGenerations: 'إجمالي التوليدات',
        usageByAction: 'الاستخدام حسب النوع',
        generate: 'توليد',
        brainstorm: 'عصف ذهني',
        extract: 'استخراج',
        trendSearch: 'بحث ترندات',
        ofTotal: 'من الإجمالي',
        planDistribution: 'توزيع الخطط',
        free: 'مجاني',
        pro: 'احترافي',
        enterprise: 'مؤسسي',
        recentSignups: 'أحدث التسجيلات',
        latestActivity: 'آخر النشاطات',
        viewAll: 'عرض الكل',
        noActivity: 'لا يوجد نشاط بعد',
        searchPlaceholder: 'بحث بالاسم أو البريد الإلكتروني...',
        user: 'المستخدم',
        plan: 'الخطة',
        credits: 'الرصيد',
        used: 'مستهلك',
        joined: 'تاريخ التسجيل',
        noUsers: 'لا يوجد مستخدمين',
        save: 'حفظ',
        topUsersByUsage: 'أكثر المستخدمين نشاطاً',
        creditOverview: 'نظرة عامة على الرصيد',
        totalDistributed: 'إجمالي الرصيد الموزع',
        remaining: 'متبقي',
        consumed: 'مستهلك',
        consumptionRate: 'معدل الاستهلاك',
        requestStatus: 'حالة الطلبات',
        successful: 'ناجح',
        failed: 'فاشل',
        totalRequests: 'إجمالي الطلبات',
        successRate: 'نسبة النجاح',
        noData: 'لا توجد بيانات بعد',
        generalSettings: 'الإعدادات العامة',
        defaultCreditsSignup: 'الرصيد الافتراضي عند التسجيل',
        creditsForNewUsers: 'الرصيد الممنوح للمستخدمين الجدد',
        maxRequestsMin: 'حد الطلبات/دقيقة',
        rateLimitPerUser: 'الحد الأقصى لكل مستخدم',
        featureToggles: 'تبديل الميزات',
        maintenanceMode: 'وضع الصيانة',
        maintenanceDesc: 'عرض صفحة صيانة لجميع المستخدمين',
        signupEnabled: 'التسجيل مفعّل',
        signupDesc: 'السماح بتسجيل مستخدمين جدد',
        systemStatus: 'حالة النظام',
        online: 'متصل',
        offline: 'غير متصل',
        aiProvider: 'مزوّد الذكاء الاصطناعي',
        checking: 'جاري الفحص…',
        all: 'الكل',
        trends: 'ترندات',
        actions: 'إجراء',
        accessDenied: 'الوصول مرفوض',
        adminOnly: 'هذه الصفحة للمسؤولين فقط',
        backToSite: '→ العودة للموقع',
    },
};

// ═══════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════
// Chart accents are CSS variables, not literals, so they can flip with the
// theme. The palette used to be hardcoded 400-level tints chosen for a dark
// page; once the dashboard started following the light theme they measured
// 1.5–2.6:1 against the near-white surface, well under the 3:1 large-text bar.
const accent = (token) => `var(${token})`;
const accentTint = (token, pct) => `color-mix(in srgb, var(${token}) ${pct}%, transparent)`;

const StatCard = ({ icon: Icon, label, value, color = '--chart-1', trend }) => (
    <div className="rounded-xl p-5 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
        style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)', boxShadow: 'var(--elevation-1)' }}>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-1">{label}</p>
                <p className="text-3xl font-bold text-text1">{value}</p>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: accentTint(color, 12), border: `1px solid ${accentTint(color, 22)}` }}>
                <Icon className="w-5 h-5" style={{ color: accent(color) }} aria-hidden="true" />
            </div>
        </div>
        {trend && (
            <div className="flex items-center gap-1 mt-3">
                <TrendingUp className="w-3 h-3" style={{ color: accent('--chart-2') }} aria-hidden="true" />
                <span className="text-[11px] font-medium" style={{ color: accent('--chart-2') }}>{trend}</span>
            </div>
        )}
    </div>
);

// ═══════════════════════════════════════
// USER TABLE ROW
// ═══════════════════════════════════════
// ═══════════════════════════════════════
// SORTABLE TABLE HEADER
// ═══════════════════════════════════════
const SortableHeader = ({ field, label, sortField, sortDir, onSort }) => {
    const isActive = sortField === field;
    return (
        <th
            className="px-4 py-3 text-[11px] font-semibold text-muted uppercase tracking-wider"
            aria-sort={isActive ? (sortDir === 'desc' ? 'descending' : 'ascending') : 'none'}
        >
            <button
                type="button"
                onClick={() => onSort(field)}
                className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-text2 transition-colors"
            >
                {label}
                {isActive && (
                    sortDir === 'desc'
                        ? <ChevronDown className="w-3 h-3" aria-hidden="true" />
                        : <ChevronUp className="w-3 h-3" aria-hidden="true" />
                )}
            </button>
        </th>
    );
};

const UserRow = ({ user, onUpdateCredits, onUpdatePlan, tx }) => {
    const [editing, setEditing] = useState(false);
    const [credits, setCredits] = useState(user.credits_remaining ?? 0);

    // Seed from the current props each time the editor opens. Initialising the
    // state once from props meant that after a save + refetch the row kept the
    // stale number, because the key (u.id) never changes.
    const startEditing = () => {
        setCredits(user.credits_remaining ?? 0);
        setEditing(true);
    };

    const handleSave = async () => {
        // parseInt('') is NaN, which JSON.stringify serialises as null — and the
        // server used to coerce that to 0 and wipe the balance. Refuse instead.
        const amount = parseInt(credits, 10);
        if (!Number.isInteger(amount) || amount < 0) return;
        await onUpdateCredits(user.id, amount);
        setEditing(false);
    };

    return (
        <tr className="border-b border-border hover:bg-white/[0.02] transition-colors">
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {(user.display_name || user.email || '?')[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-text1">{user.display_name || '—'}</p>
                        <p className="text-[11px] text-muted">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3">
                <select value={user.plan || 'free'} onChange={(e) => onUpdatePlan(user.id, e.target.value)}
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-transparent border-0 cursor-pointer focus:outline-none text-[var(--brand-fg)]">
                    <option value="free">{tx.free}</option>
                    {/* `basic` is accepted by the DB CHECK and by admin.js, but
                        was missing here — an admin could not assign it at all. */}
                    <option value="basic">{tx.basic || 'Basic'}</option>
                    <option value="pro">{tx.pro}</option>
                    <option value="enterprise">{tx.enterprise}</option>
                </select>
            </td>
            <td className="px-4 py-3">
                {editing ? (
                    <div className="flex items-center gap-2">
                        <input type="number" value={credits} onChange={(e) => setCredits(e.target.value)}
                            className="w-20 px-2 py-1 rounded bg-bg1 border border-border text-text1 text-sm" />
                        <button onClick={handleSave} className="px-2 py-1 rounded bg-indigo-600 text-white text-xs hover:bg-indigo-500">{tx.save}</button>
                        <button onClick={() => setEditing(false)} className="px-2 py-1 rounded bg-bg2 text-text1 text-xs hover:bg-bg2">✕</button>
                    </div>
                ) : (
                    <button onClick={startEditing} className="text-sm text-text2 hover:text-[var(--brand-fg)] transition-colors cursor-pointer">
                        {user.credits_remaining ?? 0}
                    </button>
                )}
            </td>
            <td className="px-4 py-3 text-sm text-text2">{user.credits_used ?? 0}</td>
            <td className="px-4 py-3 text-xs text-muted">
                {user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : '—'}
            </td>
        </tr>
    );
};

// ═══════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ═══════════════════════════════════════
const AdminDashboard = () => {
    const { user, signOut, profileLoading } = useAuth();
    const [lang, setLang] = useState('ar');
    const tx = translations[lang];
    const isRTL = lang === 'ar';

    const [stats, setStats] = useState({ totalUsers: 0, activeToday: 0, totalCreditsUsed: 0, totalGenerations: 0 });
    const [users, setUsers] = useState([]);
    const [usageLogs, setUsageLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');
    const [activeSection, setActiveSection] = useState('overview');
    const [logFilter, setLogFilter] = useState('all');

    // Settings are server state, not component state. They used to live only
    // here: the toggles moved, nothing was saved, and nothing was gated — an
    // admin could switch on "Maintenance Mode" and believe the site was closed.
    const [siteSettings, setSiteSettings] = useState(null);
    const [savedSettings, setSavedSettings] = useState(null);
    const [settingsBusy, setSettingsBusy] = useState(false);
    const [settingsError, setSettingsError] = useState('');
    const [settingsSaved, setSettingsSaved] = useState(false);

    useEffect(() => {
        let cancelled = false;
        adminApi.settings()
            .then(({ settings }) => {
                if (cancelled) return;
                setSiteSettings(settings);
                setSavedSettings(settings);
            })
            .catch((err) => { if (!cancelled) setSettingsError(err.message); });
        return () => { cancelled = true; };
    }, []);

    const settingsDirty = Boolean(siteSettings && savedSettings
        && ['defaultCredits', 'maxRequestsPerMin', 'maintenanceMode', 'signupEnabled']
            .some((k) => siteSettings[k] !== savedSettings[k]));

    const handleSaveSettings = async () => {
        if (!settingsDirty) return;
        setSettingsBusy(true);
        setSettingsError('');
        setSettingsSaved(false);
        try {
            const { settings } = await adminApi.updateSettings({
                defaultCredits: siteSettings.defaultCredits,
                maxRequestsPerMin: siteSettings.maxRequestsPerMin,
                maintenanceMode: siteSettings.maintenanceMode,
                signupEnabled: siteSettings.signupEnabled,
            });
            // Adopt what the server stored, not what was typed — the two differ
            // if a value was clamped or rejected.
            setSiteSettings(settings);
            setSavedSettings(settings);
            setSettingsSaved(true);
        } catch (err) {
            setSettingsError(err.message);
        } finally {
            setSettingsBusy(false);
        }
    };

    // Debounced copy of the search box. Without this, `fetchData` changed
    // identity on every keystroke and the effect below fired three API calls per
    // character — and a slow response for "mah" could land after "mahmoud" and
    // overwrite the newer results.
    const [debouncedQuery, setDebouncedQuery] = useState('');
    useEffect(() => {
        const id = setTimeout(() => setDebouncedQuery(searchQuery), 250);
        return () => clearTimeout(id);
    }, [searchQuery]);

    const fetchData = useCallback(async (signal) => {
        setLoading(true);
        try {
            const [overview, userList, logList] = await Promise.all([
                adminApi.overview(),
                adminApi.users({ search: debouncedQuery, sort: sortField, dir: sortDir, limit: 200 }),
                adminApi.logs({ action: logFilter, limit: 200 }),
            ]);

            // A newer request superseded this one while it was in flight.
            if (signal?.aborted) return;

            setUsers(userList.users || []);
            setUsageLogs(logList.logs || []);
            setStats({
                totalUsers: overview.users?.total || 0,
                activeToday: overview.active_today || 0,
                totalCreditsUsed: overview.users?.credits_used || 0,
                totalGenerations: overview.requests?.total || 0,
                planCounts: {
                    free: overview.users?.free || 0,
                    basic: overview.users?.basic || 0,
                    pro: overview.users?.pro || 0,
                    enterprise: overview.users?.enterprise || 0,
                },
                creditsRemaining: overview.users?.credits_remaining || 0,
                successful: overview.requests?.successful || 0,
                failed: overview.requests?.failed || 0,
                provider: overview.provider || null,
            });
        } catch (err) {
            console.error('Admin fetch error:', err.message);
        } finally {
            if (!signal?.aborted) setLoading(false);
        }
    }, [debouncedQuery, sortField, sortDir, logFilter]);

    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);
        // Aborting marks the in-flight result stale so it cannot overwrite a
        // newer one, and stops setLoading firing after unmount.
        return () => controller.abort();
    }, [fetchData]);

    // These writes succeed only for a profile whose is_admin flag is set — the
    // "Admins can update any profile" policy is what permits them.
    const handleUpdateCredits = async (userId, newCredits) => {
        try {
            await adminApi.updateUser(userId, { credits_remaining: Number(newCredits) });
            fetchData();
        } catch (err) { console.error('Update credits error:', err.message); }
    };

    const handleUpdatePlan = async (userId, newPlan) => {
        try {
            await adminApi.updateUser(userId, { plan: newPlan });
            fetchData();
        } catch (err) { console.error('Update plan error:', err.message); }
    };

    const filteredUsers = users.filter(u =>
        !searchQuery || u.email?.toLowerCase().includes(searchQuery.toLowerCase()) || u.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredLogs = usageLogs.filter(l =>
        logFilter === 'all' || l.action_type === logFilter || l.action_type === `usage_${logFilter}`
    );

    const handleSort = (field) => {
        setSortDir(sortField === field && sortDir === 'desc' ? 'asc' : 'desc');
        setSortField(field);
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDir === 'desc' ? <ChevronDown className="w-3 h-3 inline ml-1" /> : <ChevronUp className="w-3 h-3 inline ml-1" />;
    };

    // The admin flag arrives with the profile, so wait for it before deciding —
    // otherwise every admin sees a flash of "Access Denied" on load.
    if (profileLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-bg0">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Access denied
    if (!isAdmin(user)) {
        return (
            <div className="flex items-center justify-center h-screen bg-bg0">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-[var(--danger-fg)]/50 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-text1 mb-2">{tx.accessDenied}</h2>
                    <p className="text-muted">{tx.adminOnly}</p>
                    <a href="/" className="inline-block mt-4 text-sm text-[var(--brand-fg)] hover:text-[var(--brand-fg)]">{tx.backToSite}</a>
                </div>
            </div>
        );
    }

    const sidebarItems = [
        { id: 'overview', label: tx.overview, icon: BarChart3 },
        { id: 'users', label: tx.users, icon: Users },
        { id: 'analytics', label: tx.analytics, icon: TrendingUp },
        { id: 'settings', label: tx.settings, icon: Settings },
        { id: 'activity', label: tx.activityLog, icon: Activity },
    ];

    const actionLabels = { generate: tx.generate, brainstorm: tx.brainstorm, extract: tx.extract, trend_search: tx.trendSearch };
    const actionColors = { generate: '--chart-1', brainstorm: '--chart-2', extract: '--chart-3', trend_search: '--chart-4' };

    return (
        <div className="flex h-screen bg-bg0 text-text1 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* ═══ ADMIN SIDEBAR ═══ */}
            <aside className="w-[240px] flex-shrink-0 flex flex-col"
                style={{
                    background: 'var(--bg-surface)',
                    borderInlineEnd: '1px solid var(--border-color)',
                }}>
                <div className="p-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, var(--brand-1), var(--brand-3))' }}>
                            <Shield className="w-5 h-5 on-brand text-white" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-text1">{tx.adminPanel}</p>
                            <p className="text-[10px] text-muted">{tx.kemoEngine}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    {sidebarItems.map(item => {
                        const isActive = activeSection === item.id;
                        return (
                            <button key={item.id} onClick={() => setActiveSection(item.id)}
                                aria-current={isActive ? 'page' : undefined}
                                className="focus-ring touch-target relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                                style={{
                                    background: isActive ? 'var(--brand-tint)' : 'transparent',
                                    color: isActive ? 'var(--brand-fg)' : 'var(--text-secondary)',
                                    border: `1px solid ${isActive ? 'var(--brand-border)' : 'transparent'}`,
                                }}>
                                {/* Active rail — the same affordance the main app sidebar uses, so
                                    "where am I" reads identically on both sides of the product. */}
                                {isActive && (
                                    <span aria-hidden="true" className="absolute inset-block-2 w-[3px] rounded-full"
                                        style={{ insetInlineStart: 0, background: 'var(--brand-2)' }} />
                                )}
                                <item.icon className="w-4 h-4" aria-hidden="true" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    {/* Language Toggle */}
                    <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-text2 hover:text-text1 hover:bg-bg2 transition-all border border-border mb-3">
                        <Globe className="w-3.5 h-3.5" />
                        {lang === 'ar' ? 'English' : 'العربية'}
                    </button>

                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white text-xs font-bold">
                            {(user?.display_name || user?.email || 'A')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-text2 truncate">{user?.display_name || 'Admin'}</p>
                            <p className="text-[10px] text-muted truncate">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <a href="/" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text2 hover:text-text1 hover:bg-bg2 transition-all border border-border">
                            <Home className="w-3 h-3" /> {tx.site}
                        </a>
                        <button onClick={signOut} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--danger-fg)] hover:text-[var(--danger-fg)] hover:bg-red-500/10 transition-all border border-border">
                            <LogOut className="w-3 h-3" /> {tx.logout}
                        </button>
                    </div>
                </div>
            </aside>

            {/* ═══ MAIN CONTENT ═══ */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-none px-6 py-4 border-b border-border flex items-center justify-between"
                    style={{ background: 'var(--bg-surface)' }}>
                    <div>
                        <h1 className="text-lg font-bold text-text1">
                            {sidebarItems.find(s => s.id === activeSection)?.label}
                        </h1>
                        <p className="text-xs text-muted mt-0.5">
                            {activeSection === 'overview' && tx.platformPerformance}
                            {activeSection === 'users' && `${users.length} ${tx.registeredUsers}`}
                            {activeSection === 'analytics' && tx.usagePatterns}
                            {activeSection === 'settings' && tx.siteConfig}
                            {activeSection === 'activity' && `${usageLogs.length} ${tx.lastActions}`}
                        </p>
                    </div>
                    <button onClick={fetchData}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/15 text-[var(--brand-fg)] hover:bg-indigo-600/25 transition-all text-xs font-medium border border-indigo-500/20 ${loading ? 'animate-pulse' : ''}`}>
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        {tx.refresh}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {/* ═══ OVERVIEW ═══ */}
                    {activeSection === 'overview' && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <StatCard icon={Users} label={tx.totalUsers} value={stats.totalUsers} color="--chart-1" />
                                <StatCard icon={UserCheck} label={tx.activeToday} value={stats.activeToday} color="--chart-2" />
                                <StatCard icon={CreditCard} label={tx.creditsUsed} value={stats.totalCreditsUsed} color="--chart-4" />
                                <StatCard icon={Zap} label={tx.totalGenerations} value={stats.totalGenerations} color="--chart-3" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 rounded-xl p-5" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                    <h3 className="text-sm font-semibold text-text2 mb-4 flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-[var(--brand-fg)]" /> {tx.usageByAction}
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {['generate', 'brainstorm', 'extract', 'trend_search'].map(action => {
                                            const count = usageLogs.filter(l => l.action_type === `usage_${action}` || l.action_type === action).length;
                                            const total = usageLogs.length || 1;
                                            const pct = Math.round((count / total) * 100);
                                            return (
                                                <div key={action} className="p-4 rounded-lg" style={{ background: accentTint(actionColors[action], 7), border: `1px solid ${accentTint(actionColors[action], 16)}` }}>
                                                    <p className="text-[11px] text-text2 mb-1">{actionLabels[action]}</p>
                                                    <p className="text-2xl font-bold" style={{ color: accent(actionColors[action]) }}>{count}</p>
                                                    <div className="mt-2 h-1.5 rounded-full bg-bg1 overflow-hidden">
                                                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: accent(actionColors[action]) }} />
                                                    </div>
                                                    <p className="text-[10px] text-text2 mt-1">{pct}% {tx.ofTotal}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="rounded-xl p-5" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                    <h3 className="text-sm font-semibold text-text2 mb-4 flex items-center gap-2">
                                        <Crown className="w-4 h-4 text-[var(--warn-fg)]" /> {tx.planDistribution}
                                    </h3>
                                    {[{ name: 'free', color: '--chart-5' }, { name: 'pro', color: '--chart-6' }, { name: 'enterprise', color: '--chart-7' }].map(p => {
                                        const count = users.filter(u => (u.plan || 'free') === p.name).length;
                                        const total = users.length || 1;
                                        const pct = Math.round((count / total) * 100);
                                        return (
                                            <div key={p.name} className="mb-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-medium" style={{ color: p.color }}>{tx[p.name]}</span>
                                                    <span className="text-xs text-muted">{count} ({pct}%)</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-bg1 overflow-hidden">
                                                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: p.color }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="mt-6 pt-4 border-t border-border">
                                        <p className="text-[11px] text-muted mb-3 font-semibold uppercase tracking-wider">{tx.recentSignups}</p>
                                        <div className="space-y-2">
                                            {users.slice(0, 5).map(u => (
                                                <div key={u.id} className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white text-[10px] font-bold">
                                                        {(u.display_name || u.email || '?')[0].toUpperCase()}
                                                    </div>
                                                    <span className="text-xs text-text2 truncate flex-1">{u.display_name || u.email?.split('@')[0]}</span>
                                                    <span className="text-[10px] text-muted">{u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB') : ''}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 rounded-xl overflow-hidden" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-text2 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[var(--brand-fg)]" /> {tx.latestActivity}
                                    </h3>
                                    <button onClick={() => setActiveSection('activity')} className="text-[11px] text-[var(--brand-fg)] hover:text-[var(--brand-fg)] flex items-center gap-1">
                                        {tx.viewAll} <ArrowUpRight className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="divide-y divide-[var(--border-color)]">
                                    {usageLogs.slice(0, 5).map((log, idx) => {
                                        const logUser = users.find(u => u.id === log.user_id);
                                        const color = actionColors[log.action_type] || actionColors[log.action_type?.replace('usage_', '')] || '--chart-1';
                                        return (
                                            <div key={idx} className="px-5 py-3 flex items-center gap-3 hover:bg-white/[0.02]">
                                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                                                <span className="text-sm text-text2 font-medium">{logUser?.display_name || logUser?.email?.split('@')[0] || 'Unknown'}</span>
                                                <span className="font-mono text-[11px] px-1.5 py-0.5 rounded" style={{ background: `${color}15`, color }}>{log.action_type}</span>
                                                <span className="flex-1" />
                                                <span className="text-[11px] text-muted">{log.created_at ? new Date(log.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                            </div>
                                        );
                                    })}
                                    {usageLogs.length === 0 && <div className="px-5 py-8 text-center text-muted text-sm">{tx.noActivity}</div>}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ═══ USERS ═══ */}
                    {activeSection === 'users' && (
                        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                            <div className="p-4 border-b border-border flex items-center gap-3">
                                <div className="relative flex-1">
                                    <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted ${isRTL ? 'right-3' : 'left-3'}`} />
                                    <input type="text" placeholder={tx.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full py-2.5 rounded-lg bg-bg1/50 border border-border/50 text-sm text-text1 placeholder:text-muted focus:outline-none focus:border-indigo-500/50"
                                        style={isRTL ? { paddingRight: 40, paddingLeft: 12 } : { paddingLeft: 40, paddingRight: 12 }} />
                                </div>
                                <span className="text-xs text-muted flex-shrink-0">{filteredUsers.length} {tx.users}</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border bg-white/[0.02]">
                                            {/* Sorting lived on a bare <th onClick>: no keyboard
                                                access and no announcement of the current sort.
                                                aria-sort states it, and the inner button makes
                                                it operable. */}
                                            <SortableHeader field="display_name" label={tx.user} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                                            <SortableHeader field="plan" label={tx.plan} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                                            <SortableHeader field="credits_remaining" label={tx.credits} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                                            <SortableHeader field="credits_used" label={tx.used} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                                            <SortableHeader field="created_at" label={tx.joined} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(u => (
                                            <UserRow key={u.id} user={u} onUpdateCredits={handleUpdateCredits} onUpdatePlan={handleUpdatePlan} tx={tx} />
                                        ))}
                                        {filteredUsers.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-muted">{tx.noUsers}</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ═══ ANALYTICS ═══ */}
                    {activeSection === 'analytics' && (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <div className="rounded-xl p-5" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                    <h3 className="text-sm font-semibold text-text2 mb-4 flex items-center gap-2">
                                        <Crown className="w-4 h-4 text-[var(--warn-fg)]" /> {tx.topUsersByUsage}
                                    </h3>
                                    <div className="space-y-3">
                                        {[...users].sort((a, b) => (b.credits_used || 0) - (a.credits_used || 0)).slice(0, 8).map((u, i) => {
                                            const maxUsed = Math.max(...users.map(x => x.credits_used || 0), 1);
                                            const pct = Math.round(((u.credits_used || 0) / maxUsed) * 100);
                                            return (
                                                <div key={u.id} className="flex items-center gap-3">
                                                    <span className="w-5 text-[11px] text-muted font-mono">#{i + 1}</span>
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                                                        {(u.display_name || u.email || '?')[0].toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-0.5">
                                                            <span className="text-xs text-text2 truncate">{u.display_name || u.email?.split('@')[0]}</span>
                                                            <span className="text-xs text-muted">{u.credits_used || 0}</span>
                                                        </div>
                                                        <div className="h-1.5 rounded-full bg-bg1 overflow-hidden">
                                                            <div className="h-full rounded-full bg-indigo-500 transition-all duration-700" style={{ width: `${pct}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {users.length === 0 && <p className="text-sm text-muted">{tx.noData}</p>}
                                    </div>
                                </div>

                                <div className="rounded-xl p-5" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                    <h3 className="text-sm font-semibold text-text2 mb-4 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-[var(--success-fg)]" /> {tx.creditOverview}
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-lg" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
                                            <p className="text-[11px] text-muted mb-1">{tx.totalDistributed}</p>
                                            <p className="text-2xl font-bold text-[var(--brand-fg)]">{users.reduce((s, u) => s + (u.credits_remaining || 0) + (u.credits_used || 0), 0)}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.1)' }}>
                                                <p className="text-[11px] text-text2 mb-1">{tx.remaining}</p>
                                                <p className="text-xl font-bold text-[var(--success-fg)]">{users.reduce((s, u) => s + (u.credits_remaining || 0), 0)}</p>
                                            </div>
                                            <div className="p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)' }}>
                                                <p className="text-[11px] text-text2 mb-1">{tx.consumed}</p>
                                                <p className="text-xl font-bold text-[var(--danger-fg)]">{stats.totalCreditsUsed}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-muted mb-1.5">{tx.consumptionRate}</p>
                                            <div className="h-3 rounded-full bg-bg1 overflow-hidden">
                                                {(() => {
                                                    const total = users.reduce((s, u) => s + (u.credits_remaining || 0) + (u.credits_used || 0), 0) || 1;
                                                    return <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-700" style={{ width: `${Math.round((stats.totalCreditsUsed / total) * 100)}%` }} />;
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl p-5" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                <h3 className="text-sm font-semibold text-text2 mb-4 flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-[var(--brand-fg)]" /> {tx.requestStatus}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(() => {
                                        const success = usageLogs.filter(l => l.success !== false).length;
                                        const failed = usageLogs.filter(l => l.success === false).length;
                                        const total = usageLogs.length || 1;
                                        return (
                                            <>
                                                <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.1)' }}>
                                                    <CheckCircle className="w-6 h-6 text-[var(--success-fg)] mx-auto mb-2" />
                                                    <p className="text-xl font-bold text-[var(--success-fg)]">{success}</p>
                                                    <p className="text-[11px] text-text2">{tx.successful}</p>
                                                </div>
                                                <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)' }}>
                                                    <XCircle className="w-6 h-6 text-[var(--danger-fg)] mx-auto mb-2" />
                                                    <p className="text-xl font-bold text-[var(--danger-fg)]">{failed}</p>
                                                    <p className="text-[11px] text-text2">{tx.failed}</p>
                                                </div>
                                                <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
                                                    <Zap className="w-6 h-6 text-[var(--brand-fg)] mx-auto mb-2" />
                                                    <p className="text-xl font-bold text-[var(--brand-fg)]">{usageLogs.length}</p>
                                                    <p className="text-[11px] text-muted">{tx.totalRequests}</p>
                                                </div>
                                                <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.1)' }}>
                                                    <TrendingUp className="w-6 h-6 text-[var(--warn-fg)] mx-auto mb-2" />
                                                    <p className="text-xl font-bold text-[var(--warn-fg)]">{Math.round((success / total) * 100)}%</p>
                                                    <p className="text-[11px] text-muted">{tx.successRate}</p>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ═══ SETTINGS ═══ */}
                    {activeSection === 'settings' && (
                        <div className="max-w-2xl space-y-6">
                            {!siteSettings ? (
                                <div className="rounded-xl p-8 text-center text-sm text-text2"
                                    style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                    {settingsError
                                        ? <span style={{ color: 'var(--danger-fg)' }}>{settingsError}</span>
                                        : <RefreshCw className="w-4 h-4 animate-spin mx-auto" aria-hidden="true" />}
                                </div>
                            ) : (
                              <>
                            <div className="rounded-xl p-5" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                <h3 className="text-sm font-semibold text-text2 mb-4 flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-[var(--brand-fg)]" /> {tx.generalSettings}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--overlay-2)' }}>
                                        <div><label htmlFor="set-credits" className="text-sm text-text2 font-medium">{tx.defaultCreditsSignup}</label><p className="text-xs text-muted">{tx.creditsForNewUsers}</p></div>
                                        <input id="set-credits" type="number" min={0} max={100000} value={siteSettings.defaultCredits}
                                            onChange={(e) => {
                                                // An empty input yields '' -> NaN, which React drops back to
                                                // uncontrolled. Keep the raw digits and validate on save.
                                                const n = parseInt(e.target.value, 10);
                                                setSiteSettings(s => ({ ...s, defaultCredits: Number.isNaN(n) ? '' : n }));
                                            }}
                                            className="w-24 px-3 py-1.5 rounded-lg bg-bg1 border border-border text-text1 text-sm text-center focus-ring" />
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--overlay-2)' }}>
                                        <div><label htmlFor="set-rate" className="text-sm text-text2 font-medium">{tx.maxRequestsMin}</label><p className="text-xs text-muted">{tx.rateLimitPerUser}</p></div>
                                        <input id="set-rate" type="number" min={1} max={10000} value={siteSettings.maxRequestsPerMin}
                                            onChange={(e) => {
                                                const n = parseInt(e.target.value, 10);
                                                setSiteSettings(s => ({ ...s, maxRequestsPerMin: Number.isNaN(n) ? '' : n }));
                                            }}
                                            className="w-24 px-3 py-1.5 rounded-lg bg-bg1 border border-border text-text1 text-sm text-center focus-ring" />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl p-5" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                <h3 className="text-sm font-semibold text-text2 mb-4 flex items-center gap-2">
                                    <Server className="w-4 h-4 text-[var(--brand-fg)]" /> {tx.featureToggles}
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { key: 'maintenanceMode', label: tx.maintenanceMode, desc: tx.maintenanceDesc },
                                        { key: 'signupEnabled', label: tx.signupEnabled, desc: tx.signupDesc },
                                    ].map(toggle => (
                                        <div key={toggle.key} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--overlay-2)' }}>
                                            <div><p className="text-sm text-text2 font-medium">{toggle.label}</p><p className="text-xs text-muted">{toggle.desc}</p></div>
                                            <button role="switch" aria-checked={!!siteSettings[toggle.key]} aria-label={toggle.label}
                                                onClick={() => setSiteSettings(s => ({ ...s, [toggle.key]: !s[toggle.key] }))}
                                                className="focus-ring w-11 h-6 rounded-full transition-all duration-300 relative shrink-0"
                                                style={{ background: siteSettings[toggle.key] ? 'var(--cta-1)' : 'var(--bg-hover)', border: '1px solid var(--border-color)' }}>
                                                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${siteSettings[toggle.key] ? (isRTL ? 'right-[22px]' : 'left-[22px]') : (isRTL ? 'right-0.5' : 'left-0.5')}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Save bar — the panel previously had no way to persist anything. */}
                            <div className="flex items-center justify-between gap-3 rounded-xl p-4"
                                style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                <p className="text-xs" style={{ color: settingsError ? 'var(--danger-fg)' : 'var(--text-muted)' }}>
                                    {settingsError
                                        || (settingsDirty ? (isRTL ? 'فيه تغييرات مش متحفوظة' : 'Unsaved changes')
                                            : settingsSaved ? (isRTL ? '✓ اتحفظت' : '✓ Saved')
                                                : (isRTL ? 'كل حاجة متحفوظة' : 'All changes saved'))}
                                </p>
                                <button onClick={handleSaveSettings} disabled={!settingsDirty || settingsBusy}
                                    className="press focus-ring on-brand text-white rounded-lg px-4 py-2 text-xs font-bold transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                                    style={{ background: 'linear-gradient(135deg, var(--cta-1), var(--cta-2))' }}>
                                    {settingsBusy
                                        ? <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                                        : tx.save}
                                </button>
                            </div>
                              </>
                            )}

                            <div className="rounded-xl p-5" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                <h3 className="text-sm font-semibold text-text2 mb-4 flex items-center gap-2">
                                    <Wifi className="w-4 h-4 text-[var(--success-fg)]" /> {tx.systemStatus}
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        // The overview call only succeeds when the API and its
                                        // database are both up, so reaching this render proves both.
                                        { label: 'API', state: 'ok', icon: Server },
                                        { label: 'Database', state: 'ok', icon: Database },
                                        // The provider is the one dependency that actually breaks,
                                        // and it was the one this panel never checked. A revoked key
                                        // surfaced only as a 502 to users and a line in the log.
                                        {
                                            label: tx.aiProvider,
                                            state: stats.provider?.status ?? 'pending',
                                            detail: stats.provider?.detail,
                                            icon: Zap,
                                        },
                                    ].map(sys => {
                                        const ok = sys.state === 'ok';
                                        const pending = sys.state === 'pending';
                                        const color = ok ? 'var(--success-fg)' : pending ? 'var(--text-muted)' : 'var(--danger-fg)';
                                        return (
                                            <div key={sys.label} className="flex items-center justify-between gap-3 p-3 rounded-lg" style={{ background: 'var(--overlay-2)' }}>
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <sys.icon className="w-4 h-4 text-muted shrink-0" aria-hidden="true" />
                                                    <span className="text-sm text-text2">{sys.label}</span>
                                                    {sys.detail && <span className="text-[11px] text-muted truncate">— {sys.detail}</span>}
                                                </div>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                                                    <span className="text-xs" style={{ color }}>
                                                        {pending ? tx.checking : ok ? tx.online : tx.offline}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══ ACTIVITY LOG ═══ */}
                    {activeSection === 'activity' && (
                        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                            <div className="p-4 border-b border-border flex items-center gap-3">
                                <Filter className="w-4 h-4 text-muted" />
                                {[{ k: 'all', l: tx.all }, { k: 'generate', l: tx.generate }, { k: 'brainstorm', l: tx.brainstorm }, { k: 'extract', l: tx.extract }, { k: 'trend_search', l: tx.trends }].map(f => (
                                    <button key={f.k} onClick={() => setLogFilter(f.k)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${logFilter === f.k ? 'bg-[var(--brand-tint)] text-[var(--brand-fg)] border border-[var(--brand-border)]' : 'text-muted hover:text-text2 border border-transparent'
                                            }`}>
                                        {f.l}
                                    </button>
                                ))}
                                <span className="flex-1" />
                                <span className="text-xs text-muted">{filteredLogs.length} {tx.actions}</span>
                            </div>
                            <div className="divide-y divide-[var(--border-color)] max-h-[calc(100vh-280px)] overflow-y-auto">
                                {filteredLogs.map((log, idx) => {
                                    const logUser = users.find(u => u.id === log.user_id);
                                    const color = actionColors[log.action_type] || actionColors[log.action_type?.replace('usage_', '')] || '--chart-1';
                                    return (
                                        <div key={idx} className="px-5 py-3 flex items-center gap-3 hover:bg-white/[0.02]">
                                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-text2 truncate">
                                                    <span className="font-medium">{logUser?.display_name || logUser?.email?.split('@')[0] || 'Unknown'}</span>
                                                    <span className="text-muted mx-2">→</span>
                                                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded" style={{ background: `${color}15`, color }}>{log.action_type}</span>
                                                </p>
                                                {log.input_summary && <p className="text-[11px] text-muted truncate mt-0.5">{log.input_summary}</p>}
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <span className="text-[11px] text-muted">-{log.credits_consumed || 0} cr</span>
                                                <span className="text-[11px] text-muted">{log.created_at ? new Date(log.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                                {log.success === false && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-[var(--danger-fg)]">{tx.failed}</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredLogs.length === 0 && <div className="px-4 py-12 text-center text-muted">{tx.noActivity}</div>}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
