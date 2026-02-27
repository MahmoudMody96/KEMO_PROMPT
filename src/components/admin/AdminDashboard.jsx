// src/components/admin/AdminDashboard.jsx — Professional Admin Dashboard
// Bilingual: Arabic + English with language toggle

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSupabase, isSupabaseConfigured } from '../../lib/supabase';
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

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
export const isAdmin = (user) => user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

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
        all: 'All',
        trends: 'Trends',
        actions: 'actions',
        accessDenied: 'Access Denied',
        adminOnly: 'This page is for administrators only',
        backToSite: '← Back to site',
        supabaseNotConfigured: 'Supabase Not Configured',
        addEnvVars: 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment',
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
        all: 'الكل',
        trends: 'ترندات',
        actions: 'إجراء',
        accessDenied: 'الوصول مرفوض',
        adminOnly: 'هذه الصفحة للمسؤولين فقط',
        backToSite: '→ العودة للموقع',
        supabaseNotConfigured: 'Supabase غير مُفعّل',
        addEnvVars: 'أضف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في إعدادات البيئة',
    },
};

// ═══════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════
const StatCard = ({ icon: Icon, label, value, color = '#818cf8', trend }) => (
    <div className="rounded-xl p-5 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
        style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">{label}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Icon className="w-5 h-5" style={{ color }} />
            </div>
        </div>
        {trend && (
            <div className="flex items-center gap-1 mt-3">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-[11px] text-emerald-400 font-medium">{trend}</span>
            </div>
        )}
    </div>
);

// ═══════════════════════════════════════
// USER TABLE ROW
// ═══════════════════════════════════════
const UserRow = ({ user, onUpdateCredits, onUpdatePlan, tx }) => {
    const [editing, setEditing] = useState(false);
    const [credits, setCredits] = useState(user.credits_remaining || 0);

    const handleSave = async () => {
        await onUpdateCredits(user.id, parseInt(credits));
        setEditing(false);
    };

    return (
        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {(user.display_name || user.email || '?')[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-200">{user.display_name || '—'}</p>
                        <p className="text-[11px] text-zinc-500">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3">
                <select value={user.plan || 'free'} onChange={(e) => onUpdatePlan(user.id, e.target.value)}
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-transparent border-0 cursor-pointer focus:outline-none text-indigo-400">
                    <option value="free">{tx.free}</option>
                    <option value="pro">{tx.pro}</option>
                    <option value="enterprise">{tx.enterprise}</option>
                </select>
            </td>
            <td className="px-4 py-3">
                {editing ? (
                    <div className="flex items-center gap-2">
                        <input type="number" value={credits} onChange={(e) => setCredits(e.target.value)}
                            className="w-20 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-white text-sm" />
                        <button onClick={handleSave} className="px-2 py-1 rounded bg-indigo-600 text-white text-xs hover:bg-indigo-500">{tx.save}</button>
                        <button onClick={() => setEditing(false)} className="px-2 py-1 rounded bg-zinc-700 text-white text-xs hover:bg-zinc-600">✕</button>
                    </div>
                ) : (
                    <button onClick={() => setEditing(true)} className="text-sm text-zinc-300 hover:text-indigo-400 transition-colors cursor-pointer">
                        {user.credits_remaining ?? 0}
                    </button>
                )}
            </td>
            <td className="px-4 py-3 text-sm text-zinc-400">{user.credits_used ?? 0}</td>
            <td className="px-4 py-3 text-xs text-zinc-500">
                {user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : '—'}
            </td>
        </tr>
    );
};

// ═══════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ═══════════════════════════════════════
const AdminDashboard = () => {
    const { user, signOut } = useAuth();
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

    const [siteSettings, setSiteSettings] = useState({
        defaultCredits: 20, maintenanceMode: false, signupEnabled: true, maxRequestsPerMin: 10,
    });

    const fetchData = useCallback(async () => {
        if (!isSupabaseConfigured()) { setLoading(false); return; }
        setLoading(true);
        try {
            const supabase = await getSupabase();
            if (!supabase) return;
            const { data: usersData } = await supabase.from('profiles').select('*').order(sortField, { ascending: sortDir === 'asc' });
            const { data: logsData } = await supabase.from('usage_logs').select('*').order('created_at', { ascending: false }).limit(200);
            const allUsers = usersData || [];
            const allLogs = logsData || [];
            const today = new Date().toISOString().split('T')[0];
            const todayLogs = allLogs.filter(l => l.created_at?.startsWith(today));
            setUsers(allUsers);
            setUsageLogs(allLogs);
            setStats({
                totalUsers: allUsers.length,
                activeToday: new Set(todayLogs.map(l => l.user_id)).size,
                totalCreditsUsed: allUsers.reduce((sum, u) => sum + (u.credits_used || 0), 0),
                totalGenerations: allLogs.length,
            });
        } catch (err) { console.error('Admin fetch error:', err); }
        finally { setLoading(false); }
    }, [sortField, sortDir]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleUpdateCredits = async (userId, newCredits) => {
        try {
            const supabase = await getSupabase();
            if (!supabase) return;
            await supabase.from('profiles').update({ credits_remaining: newCredits }).eq('id', userId);
            fetchData();
        } catch (err) { console.error('Update credits error:', err); }
    };

    const handleUpdatePlan = async (userId, newPlan) => {
        try {
            const supabase = await getSupabase();
            if (!supabase) return;
            await supabase.from('profiles').update({ plan: newPlan }).eq('id', userId);
            fetchData();
        } catch (err) { console.error('Update plan error:', err); }
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

    // Access denied
    if (!isAdmin(user)) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0a0a1a]">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-red-400/50 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">{tx.accessDenied}</h2>
                    <p className="text-zinc-500">{tx.adminOnly}</p>
                    <a href="/" className="inline-block mt-4 text-sm text-indigo-400 hover:text-indigo-300">{tx.backToSite}</a>
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
    const actionColors = { generate: '#818cf8', brainstorm: '#34d399', extract: '#38bdf8', trend_search: '#fb923c' };

    return (
        <div className="flex h-screen bg-[#0a0a1a] text-white overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* ═══ ADMIN SIDEBAR ═══ */}
            <aside className={`w-[240px] flex-shrink-0 flex flex-col ${isRTL ? 'border-l' : 'border-r'} border-white/5`}
                style={{ background: 'rgba(13,17,23,0.95)' }}>
                <div className="p-5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{tx.adminPanel}</p>
                            <p className="text-[10px] text-zinc-500">{tx.kemoEngine}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    {sidebarItems.map(item => (
                        <button key={item.id} onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === item.id
                                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                                }`}>
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    {/* Language Toggle */}
                    <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-white/5 mb-3">
                        <Globe className="w-3.5 h-3.5" />
                        {lang === 'ar' ? 'English' : 'العربية'}
                    </button>

                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                            {(user?.display_name || user?.email || 'A')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-zinc-300 truncate">{user?.display_name || 'Admin'}</p>
                            <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <a href="/" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-white/5">
                            <Home className="w-3 h-3" /> {tx.site}
                        </a>
                        <button onClick={signOut} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all border border-white/5">
                            <LogOut className="w-3 h-3" /> {tx.logout}
                        </button>
                    </div>
                </div>
            </aside>

            {/* ═══ MAIN CONTENT ═══ */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-none px-6 py-4 border-b border-white/5 flex items-center justify-between"
                    style={{ background: 'rgba(13,17,23,0.6)' }}>
                    <div>
                        <h1 className="text-lg font-bold text-white">
                            {sidebarItems.find(s => s.id === activeSection)?.label}
                        </h1>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            {activeSection === 'overview' && tx.platformPerformance}
                            {activeSection === 'users' && `${users.length} ${tx.registeredUsers}`}
                            {activeSection === 'analytics' && tx.usagePatterns}
                            {activeSection === 'settings' && tx.siteConfig}
                            {activeSection === 'activity' && `${usageLogs.length} ${tx.lastActions}`}
                        </p>
                    </div>
                    <button onClick={fetchData}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/15 text-indigo-400 hover:bg-indigo-600/25 transition-all text-xs font-medium border border-indigo-500/20 ${loading ? 'animate-pulse' : ''}`}>
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        {tx.refresh}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {!isSupabaseConfigured() && (
                        <div className="flex items-center justify-center h-[60vh]">
                            <div className="text-center">
                                <AlertTriangle className="w-16 h-16 text-amber-400/50 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-white mb-2">{tx.supabaseNotConfigured}</h2>
                                <p className="text-zinc-500 max-w-md">{tx.addEnvVars}</p>
                            </div>
                        </div>
                    )}

                    {/* ═══ OVERVIEW ═══ */}
                    {isSupabaseConfigured() && activeSection === 'overview' && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <StatCard icon={Users} label={tx.totalUsers} value={stats.totalUsers} color="#818cf8" />
                                <StatCard icon={UserCheck} label={tx.activeToday} value={stats.activeToday} color="#34d399" />
                                <StatCard icon={CreditCard} label={tx.creditsUsed} value={stats.totalCreditsUsed} color="#f59e0b" />
                                <StatCard icon={Zap} label={tx.totalGenerations} value={stats.totalGenerations} color="#38bdf8" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 rounded-xl p-5" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                    <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-indigo-400" /> {tx.usageByAction}
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {['generate', 'brainstorm', 'extract', 'trend_search'].map(action => {
                                            const count = usageLogs.filter(l => l.action_type === `usage_${action}` || l.action_type === action).length;
                                            const total = usageLogs.length || 1;
                                            const pct = Math.round((count / total) * 100);
                                            return (
                                                <div key={action} className="p-4 rounded-lg" style={{ background: `${actionColors[action]}08`, border: `1px solid ${actionColors[action]}15` }}>
                                                    <p className="text-[11px] text-zinc-500 mb-1">{actionLabels[action]}</p>
                                                    <p className="text-2xl font-bold" style={{ color: actionColors[action] }}>{count}</p>
                                                    <div className="mt-2 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                                                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: actionColors[action] }} />
                                                    </div>
                                                    <p className="text-[10px] text-zinc-600 mt-1">{pct}% {tx.ofTotal}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="rounded-xl p-5" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                    <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                                        <Crown className="w-4 h-4 text-amber-400" /> {tx.planDistribution}
                                    </h3>
                                    {[{ name: 'free', color: '#60a5fa' }, { name: 'pro', color: '#a78bfa' }, { name: 'enterprise', color: '#fbbf24' }].map(p => {
                                        const count = users.filter(u => (u.plan || 'free') === p.name).length;
                                        const total = users.length || 1;
                                        const pct = Math.round((count / total) * 100);
                                        return (
                                            <div key={p.name} className="mb-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-medium" style={{ color: p.color }}>{tx[p.name]}</span>
                                                    <span className="text-xs text-zinc-500">{count} ({pct}%)</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                                                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: p.color }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="mt-6 pt-4 border-t border-white/5">
                                        <p className="text-[11px] text-zinc-500 mb-3 font-semibold uppercase tracking-wider">{tx.recentSignups}</p>
                                        <div className="space-y-2">
                                            {users.slice(0, 5).map(u => (
                                                <div key={u.id} className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold">
                                                        {(u.display_name || u.email || '?')[0].toUpperCase()}
                                                    </div>
                                                    <span className="text-xs text-zinc-400 truncate flex-1">{u.display_name || u.email?.split('@')[0]}</span>
                                                    <span className="text-[10px] text-zinc-600">{u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB') : ''}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 rounded-xl overflow-hidden" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-indigo-400" /> {tx.latestActivity}
                                    </h3>
                                    <button onClick={() => setActiveSection('activity')} className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                        {tx.viewAll} <ArrowUpRight className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {usageLogs.slice(0, 5).map((log, idx) => {
                                        const logUser = users.find(u => u.id === log.user_id);
                                        const color = actionColors[log.action_type] || actionColors[log.action_type?.replace('usage_', '')] || '#818cf8';
                                        return (
                                            <div key={idx} className="px-5 py-3 flex items-center gap-3 hover:bg-white/[0.02]">
                                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                                                <span className="text-sm text-zinc-300 font-medium">{logUser?.display_name || logUser?.email?.split('@')[0] || 'Unknown'}</span>
                                                <span className="font-mono text-[11px] px-1.5 py-0.5 rounded" style={{ background: `${color}15`, color }}>{log.action_type}</span>
                                                <span className="flex-1" />
                                                <span className="text-[11px] text-zinc-600">{log.created_at ? new Date(log.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                            </div>
                                        );
                                    })}
                                    {usageLogs.length === 0 && <div className="px-5 py-8 text-center text-zinc-500 text-sm">{tx.noActivity}</div>}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ═══ USERS ═══ */}
                    {isSupabaseConfigured() && activeSection === 'users' && (
                        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                            <div className="p-4 border-b border-white/5 flex items-center gap-3">
                                <div className="relative flex-1">
                                    <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 ${isRTL ? 'right-3' : 'left-3'}`} />
                                    <input type="text" placeholder={tx.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full py-2.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                                        style={isRTL ? { paddingRight: 40, paddingLeft: 12 } : { paddingLeft: 40, paddingRight: 12 }} />
                                </div>
                                <span className="text-xs text-zinc-500 flex-shrink-0">{filteredUsers.length} {tx.users}</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.02]">
                                            <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300" onClick={() => handleSort('display_name')}>
                                                {tx.user} <SortIcon field="display_name" />
                                            </th>
                                            <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300" onClick={() => handleSort('plan')}>
                                                {tx.plan} <SortIcon field="plan" />
                                            </th>
                                            <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300" onClick={() => handleSort('credits_remaining')}>
                                                {tx.credits} <SortIcon field="credits_remaining" />
                                            </th>
                                            <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300" onClick={() => handleSort('credits_used')}>
                                                {tx.used} <SortIcon field="credits_used" />
                                            </th>
                                            <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300" onClick={() => handleSort('created_at')}>
                                                {tx.joined} <SortIcon field="created_at" />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(u => (
                                            <UserRow key={u.id} user={u} onUpdateCredits={handleUpdateCredits} onUpdatePlan={handleUpdatePlan} tx={tx} />
                                        ))}
                                        {filteredUsers.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-zinc-500">{tx.noUsers}</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ═══ ANALYTICS ═══ */}
                    {isSupabaseConfigured() && activeSection === 'analytics' && (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <div className="rounded-xl p-5" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                    <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                                        <Crown className="w-4 h-4 text-amber-400" /> {tx.topUsersByUsage}
                                    </h3>
                                    <div className="space-y-3">
                                        {[...users].sort((a, b) => (b.credits_used || 0) - (a.credits_used || 0)).slice(0, 8).map((u, i) => {
                                            const maxUsed = Math.max(...users.map(x => x.credits_used || 0), 1);
                                            const pct = Math.round(((u.credits_used || 0) / maxUsed) * 100);
                                            return (
                                                <div key={u.id} className="flex items-center gap-3">
                                                    <span className="w-5 text-[11px] text-zinc-600 font-mono">#{i + 1}</span>
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                                                        {(u.display_name || u.email || '?')[0].toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-0.5">
                                                            <span className="text-xs text-zinc-300 truncate">{u.display_name || u.email?.split('@')[0]}</span>
                                                            <span className="text-xs text-zinc-500">{u.credits_used || 0}</span>
                                                        </div>
                                                        <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                                                            <div className="h-full rounded-full bg-indigo-500 transition-all duration-700" style={{ width: `${pct}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {users.length === 0 && <p className="text-sm text-zinc-500">{tx.noData}</p>}
                                    </div>
                                </div>

                                <div className="rounded-xl p-5" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                    <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-emerald-400" /> {tx.creditOverview}
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-lg" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
                                            <p className="text-[11px] text-zinc-500 mb-1">{tx.totalDistributed}</p>
                                            <p className="text-2xl font-bold text-indigo-400">{users.reduce((s, u) => s + (u.credits_remaining || 0) + (u.credits_used || 0), 0)}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.1)' }}>
                                                <p className="text-[11px] text-zinc-500 mb-1">{tx.remaining}</p>
                                                <p className="text-xl font-bold text-emerald-400">{users.reduce((s, u) => s + (u.credits_remaining || 0), 0)}</p>
                                            </div>
                                            <div className="p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)' }}>
                                                <p className="text-[11px] text-zinc-500 mb-1">{tx.consumed}</p>
                                                <p className="text-xl font-bold text-red-400">{stats.totalCreditsUsed}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-zinc-500 mb-1.5">{tx.consumptionRate}</p>
                                            <div className="h-3 rounded-full bg-zinc-800 overflow-hidden">
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
                                <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-indigo-400" /> {tx.requestStatus}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(() => {
                                        const success = usageLogs.filter(l => l.success !== false).length;
                                        const failed = usageLogs.filter(l => l.success === false).length;
                                        const total = usageLogs.length || 1;
                                        return (
                                            <>
                                                <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.1)' }}>
                                                    <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                                                    <p className="text-xl font-bold text-emerald-400">{success}</p>
                                                    <p className="text-[11px] text-zinc-500">{tx.successful}</p>
                                                </div>
                                                <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)' }}>
                                                    <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                                                    <p className="text-xl font-bold text-red-400">{failed}</p>
                                                    <p className="text-[11px] text-zinc-500">{tx.failed}</p>
                                                </div>
                                                <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
                                                    <Zap className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                                                    <p className="text-xl font-bold text-indigo-400">{usageLogs.length}</p>
                                                    <p className="text-[11px] text-zinc-500">{tx.totalRequests}</p>
                                                </div>
                                                <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.1)' }}>
                                                    <TrendingUp className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                                                    <p className="text-xl font-bold text-amber-400">{Math.round((success / total) * 100)}%</p>
                                                    <p className="text-[11px] text-zinc-500">{tx.successRate}</p>
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
                            <div className="rounded-xl p-5" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-indigo-400" /> {tx.generalSettings}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                                        <div><p className="text-sm text-zinc-300 font-medium">{tx.defaultCreditsSignup}</p><p className="text-xs text-zinc-500">{tx.creditsForNewUsers}</p></div>
                                        <input type="number" value={siteSettings.defaultCredits} onChange={(e) => setSiteSettings(s => ({ ...s, defaultCredits: parseInt(e.target.value) }))}
                                            className="w-20 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm text-center focus:outline-none focus:border-indigo-500" />
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                                        <div><p className="text-sm text-zinc-300 font-medium">{tx.maxRequestsMin}</p><p className="text-xs text-zinc-500">{tx.rateLimitPerUser}</p></div>
                                        <input type="number" value={siteSettings.maxRequestsPerMin} onChange={(e) => setSiteSettings(s => ({ ...s, maxRequestsPerMin: parseInt(e.target.value) }))}
                                            className="w-20 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm text-center focus:outline-none focus:border-indigo-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl p-5" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                                    <Server className="w-4 h-4 text-indigo-400" /> {tx.featureToggles}
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { key: 'maintenanceMode', label: tx.maintenanceMode, desc: tx.maintenanceDesc },
                                        { key: 'signupEnabled', label: tx.signupEnabled, desc: tx.signupDesc },
                                    ].map(toggle => (
                                        <div key={toggle.key} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                                            <div><p className="text-sm text-zinc-300 font-medium">{toggle.label}</p><p className="text-xs text-zinc-500">{toggle.desc}</p></div>
                                            <button onClick={() => setSiteSettings(s => ({ ...s, [toggle.key]: !s[toggle.key] }))}
                                                className={`w-11 h-6 rounded-full transition-all duration-300 relative ${siteSettings[toggle.key] ? 'bg-indigo-600' : 'bg-zinc-700'}`}>
                                                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${siteSettings[toggle.key] ? (isRTL ? 'right-[22px]' : 'left-[22px]') : (isRTL ? 'right-0.5' : 'left-0.5')}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-xl p-5" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                                <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                                    <Wifi className="w-4 h-4 text-emerald-400" /> {tx.systemStatus}
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Supabase', status: isSupabaseConfigured(), icon: Database },
                                        { label: 'OpenRouter API', status: true, icon: Server },
                                        { label: 'Vercel CDN', status: true, icon: Wifi },
                                    ].map(sys => (
                                        <div key={sys.label} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                                            <div className="flex items-center gap-2"><sys.icon className="w-4 h-4 text-zinc-500" /><span className="text-sm text-zinc-300">{sys.label}</span></div>
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${sys.status ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                                <span className={`text-xs ${sys.status ? 'text-emerald-400' : 'text-red-400'}`}>{sys.status ? tx.online : tx.offline}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══ ACTIVITY LOG ═══ */}
                    {isSupabaseConfigured() && activeSection === 'activity' && (
                        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--overlay-3)', border: '1px solid var(--border-color)' }}>
                            <div className="p-4 border-b border-white/5 flex items-center gap-3">
                                <Filter className="w-4 h-4 text-zinc-500" />
                                {[{ k: 'all', l: tx.all }, { k: 'generate', l: tx.generate }, { k: 'brainstorm', l: tx.brainstorm }, { k: 'extract', l: tx.extract }, { k: 'trend_search', l: tx.trends }].map(f => (
                                    <button key={f.k} onClick={() => setLogFilter(f.k)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${logFilter === f.k ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                                            }`}>
                                        {f.l}
                                    </button>
                                ))}
                                <span className="flex-1" />
                                <span className="text-xs text-zinc-500">{filteredLogs.length} {tx.actions}</span>
                            </div>
                            <div className="divide-y divide-white/5 max-h-[calc(100vh-280px)] overflow-y-auto">
                                {filteredLogs.map((log, idx) => {
                                    const logUser = users.find(u => u.id === log.user_id);
                                    const color = actionColors[log.action_type] || actionColors[log.action_type?.replace('usage_', '')] || '#818cf8';
                                    return (
                                        <div key={idx} className="px-5 py-3 flex items-center gap-3 hover:bg-white/[0.02]">
                                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-zinc-300 truncate">
                                                    <span className="font-medium">{logUser?.display_name || logUser?.email?.split('@')[0] || 'Unknown'}</span>
                                                    <span className="text-zinc-500 mx-2">→</span>
                                                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded" style={{ background: `${color}15`, color }}>{log.action_type}</span>
                                                </p>
                                                {log.input_summary && <p className="text-[11px] text-zinc-600 truncate mt-0.5">{log.input_summary}</p>}
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <span className="text-[11px] text-zinc-600">-{log.credits_consumed || 0} cr</span>
                                                <span className="text-[11px] text-zinc-600">{log.created_at ? new Date(log.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                                {log.success === false && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">{tx.failed}</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredLogs.length === 0 && <div className="px-4 py-12 text-center text-zinc-500">{tx.noActivity}</div>}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
