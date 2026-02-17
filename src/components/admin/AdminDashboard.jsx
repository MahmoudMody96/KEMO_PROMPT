// src/components/admin/AdminDashboard.jsx — Admin Panel
// Shows platform statistics, user management, and usage analytics
// Only accessible to admin users (checked by email)

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { getSupabase, isSupabaseConfigured } from '../../lib/supabase';
import {
    Users, BarChart3, CreditCard, Activity,
    TrendingUp, Clock, Shield, RefreshCw,
    Search, ChevronDown, ChevronUp, Zap,
    UserCheck, UserX, Crown, AlertTriangle
} from 'lucide-react';

// Admin emails — add your email here
const ADMIN_EMAILS = [
    'mahmoud.abdelmonem1710@gmail.com',
    // Add more admin emails as needed
];

export const isAdmin = (user) => {
    if (!user?.email) return false;
    return ADMIN_EMAILS.includes(user.email.toLowerCase());
};

// ═══════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════
const StatCard = ({ icon: Icon, label, value, subtitle, color = '#818cf8', trend }) => (
    <div className="rounded-xl p-5 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
        style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">{label}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
                {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
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
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `radial-gradient(circle at top right, ${color}08, transparent 70%)` }} />
    </div>
);

// ═══════════════════════════════════════
// USER TABLE ROW
// ═══════════════════════════════════════
const UserRow = ({ user, isRTL, onUpdateCredits }) => {
    const [editing, setEditing] = useState(false);
    const [credits, setCredits] = useState(user.credits_remaining || 0);

    const planColors = {
        free: { bg: '#3b82f620', text: '#60a5fa', label: 'Free' },
        pro: { bg: '#8b5cf620', text: '#a78bfa', label: 'Pro' },
        enterprise: { bg: '#f59e0b20', text: '#fbbf24', label: 'Enterprise' },
    };
    const plan = planColors[user.plan] || planColors.free;

    const handleSave = async () => {
        await onUpdateCredits(user.id, parseInt(credits));
        setEditing(false);
    };

    return (
        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
            <td className="px-4 py-3">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {(user.display_name || user.email || '?')[0].toUpperCase()}
                    </div>
                    <div className={isRTL ? 'text-right' : ''}>
                        <p className="text-sm font-medium text-zinc-200">{user.display_name || '—'}</p>
                        <p className="text-[11px] text-zinc-500">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{ background: plan.bg, color: plan.text }}>
                    {plan.label}
                </span>
            </td>
            <td className="px-4 py-3">
                {editing ? (
                    <div className="flex items-center gap-2">
                        <input type="number" value={credits} onChange={(e) => setCredits(e.target.value)}
                            className="w-20 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-white text-sm" />
                        <button onClick={handleSave} className="px-2 py-1 rounded bg-indigo-600 text-white text-xs hover:bg-indigo-500">Save</button>
                        <button onClick={() => setEditing(false)} className="px-2 py-1 rounded bg-zinc-700 text-white text-xs hover:bg-zinc-600">✕</button>
                    </div>
                ) : (
                    <button onClick={() => setEditing(true)}
                        className="text-sm text-zinc-300 hover:text-indigo-400 transition-colors cursor-pointer">
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
    const { user } = useAuth();
    const { language, isRTL } = useAppContext();
    const isAr = language === 'ar';

    const [stats, setStats] = useState({ totalUsers: 0, activeToday: 0, totalCreditsUsed: 0, totalGenerations: 0 });
    const [users, setUsers] = useState([]);
    const [usageLogs, setUsageLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');
    const [activeSection, setActiveSection] = useState('overview');

    // Fetch all data
    const fetchData = useCallback(async () => {
        if (!isSupabaseConfigured()) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const supabase = await getSupabase();
            if (!supabase) return;

            // Fetch users
            const { data: usersData } = await supabase
                .from('profiles')
                .select('*')
                .order(sortField, { ascending: sortDir === 'asc' });

            // Fetch recent usage logs
            const { data: logsData } = await supabase
                .from('usage_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            const allUsers = usersData || [];
            const allLogs = logsData || [];

            // Calculate stats
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
        } catch (err) {
            console.error('Admin fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [sortField, sortDir]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Update user credits
    const handleUpdateCredits = async (userId, newCredits) => {
        try {
            const supabase = await getSupabase();
            if (!supabase) return;
            await supabase.from('profiles').update({ credits_remaining: newCredits }).eq('id', userId);
            fetchData(); // Refresh
        } catch (err) {
            console.error('Update credits error:', err);
        }
    };

    // Filter users
    const filteredUsers = users.filter(u =>
        !searchQuery ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort handler
    const handleSort = (field) => {
        setSortDir(sortField === field && sortDir === 'desc' ? 'asc' : 'desc');
        setSortField(field);
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDir === 'desc' ? <ChevronDown className="w-3 h-3 inline ml-1" /> : <ChevronUp className="w-3 h-3 inline ml-1" />;
    };

    // Not admin? Show access denied
    if (!isAdmin(user)) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-red-400/50 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isAr ? 'الوصول مرفوض' : 'Access Denied'}
                    </h2>
                    <p className="text-zinc-500">
                        {isAr ? 'هذه الصفحة للمسؤولين فقط' : 'This page is for administrators only'}
                    </p>
                </div>
            </div>
        );
    }

    // Supabase not configured
    if (!isSupabaseConfigured()) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-amber-400/50 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isAr ? 'Supabase غير مُفعّل' : 'Supabase Not Configured'}
                    </h2>
                    <p className="text-zinc-500 max-w-md">
                        {isAr ? 'أضف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في Vercel' : 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`max-w-7xl mx-auto ${isRTL ? 'text-right' : ''}`}>
            {/* Header */}
            <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Shield className="w-7 h-7 text-indigo-400" />
                        {isAr ? 'لوحة التحكم' : 'Admin Dashboard'}
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        {isAr ? 'إدارة المستخدمين والإحصائيات' : 'Manage users, credits & analytics'}
                    </p>
                </div>
                <button onClick={fetchData}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-all text-sm font-medium ${loading ? 'animate-pulse' : ''}`}>
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {isAr ? 'تحديث' : 'Refresh'}
                </button>
            </div>

            {/* Section Tabs */}
            <div className={`flex gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {[
                    { id: 'overview', labelEn: 'Overview', labelAr: 'نظرة عامة', icon: BarChart3 },
                    { id: 'users', labelEn: 'Users', labelAr: 'المستخدمين', icon: Users },
                    { id: 'activity', labelEn: 'Activity Log', labelAr: 'سجل النشاط', icon: Activity },
                ].map(tab => (
                    <button key={tab.id}
                        onClick={() => setActiveSection(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${activeSection === tab.id
                                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'}
                            ${isRTL ? 'flex-row-reverse' : ''}
                        `}>
                        <tab.icon className="w-4 h-4" />
                        {isAr ? tab.labelAr : tab.labelEn}
                    </button>
                ))}
            </div>

            {/* Overview Section */}
            {activeSection === 'overview' && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard icon={Users} label={isAr ? 'إجمالي المستخدمين' : 'Total Users'} value={stats.totalUsers} color="#818cf8" />
                        <StatCard icon={UserCheck} label={isAr ? 'نشطين اليوم' : 'Active Today'} value={stats.activeToday} color="#34d399" />
                        <StatCard icon={CreditCard} label={isAr ? 'الكريديت المستخدم' : 'Credits Used'} value={stats.totalCreditsUsed} color="#f59e0b" />
                        <StatCard icon={Zap} label={isAr ? 'إجمالي التوليدات' : 'Total Generations'} value={stats.totalGenerations} color="#38bdf8" />
                    </div>

                    {/* Usage by action type */}
                    <div className="rounded-xl p-5 mb-6"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-indigo-400" />
                            {isAr ? 'الاستخدام حسب النوع' : 'Usage by Action Type'}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['generate', 'brainstorm', 'extract', 'trend_search'].map(action => {
                                const count = usageLogs.filter(l => l.action_type === `usage_${action}` || l.action_type === action).length;
                                const colors = { generate: '#818cf8', brainstorm: '#34d399', extract: '#38bdf8', trend_search: '#fb923c' };
                                const labels = {
                                    generate: isAr ? 'توليد' : 'Generate',
                                    brainstorm: isAr ? 'عصف ذهني' : 'Brainstorm',
                                    extract: isAr ? 'استخراج' : 'Extract',
                                    trend_search: isAr ? 'بحث ترند' : 'Trend Search',
                                };
                                return (
                                    <div key={action} className="p-3 rounded-lg" style={{ background: `${colors[action]}08`, border: `1px solid ${colors[action]}15` }}>
                                        <p className="text-[11px] text-zinc-500 mb-1">{labels[action]}</p>
                                        <p className="text-xl font-bold" style={{ color: colors[action] }}>{count}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Plan distribution */}
                    <div className="rounded-xl p-5"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                            <Crown className="w-4 h-4 text-amber-400" />
                            {isAr ? 'توزيع الخطط' : 'Plan Distribution'}
                        </h3>
                        <div className="flex gap-4">
                            {['free', 'pro', 'enterprise'].map(plan => {
                                const count = users.filter(u => (u.plan || 'free') === plan).length;
                                const total = users.length || 1;
                                const pct = Math.round((count / total) * 100);
                                const colors = { free: '#60a5fa', pro: '#a78bfa', enterprise: '#fbbf24' };
                                return (
                                    <div key={plan} className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium capitalize" style={{ color: colors[plan] }}>{plan}</span>
                                            <span className="text-xs text-zinc-500">{count} ({pct}%)</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: colors[plan] }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            {/* Users Section */}
            {activeSection === 'users' && (
                <div className="rounded-xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {/* Search */}
                    <div className="p-4 border-b border-white/5">
                        <div className={`relative ${isRTL ? 'text-right' : ''}`}>
                            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 ${isRTL ? 'right-3' : 'left-3'}`} />
                            <input
                                type="text"
                                placeholder={isAr ? 'بحث بالاسم أو الإيميل...' : 'Search by name or email...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                            />
                        </div>
                        <p className="text-[11px] text-zinc-600 mt-2">
                            {isAr ? `${filteredUsers.length} مستخدم` : `${filteredUsers.length} users found`}
                        </p>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300"
                                        onClick={() => handleSort('display_name')}>
                                        {isAr ? 'المستخدم' : 'User'} <SortIcon field="display_name" />
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300"
                                        onClick={() => handleSort('plan')}>
                                        {isAr ? 'الخطة' : 'Plan'} <SortIcon field="plan" />
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300"
                                        onClick={() => handleSort('credits_remaining')}>
                                        {isAr ? 'الرصيد' : 'Credits'} <SortIcon field="credits_remaining" />
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300"
                                        onClick={() => handleSort('credits_used')}>
                                        {isAr ? 'المستخدم' : 'Used'} <SortIcon field="credits_used" />
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300"
                                        onClick={() => handleSort('created_at')}>
                                        {isAr ? 'تاريخ التسجيل' : 'Joined'} <SortIcon field="created_at" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(u => (
                                    <UserRow key={u.id} user={u} isRTL={isRTL} onUpdateCredits={handleUpdateCredits} />
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-zinc-500">
                                            {isAr ? 'لا يوجد مستخدمين' : 'No users found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Activity Log Section */}
            {activeSection === 'activity' && (
                <div className="rounded-xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="p-4 border-b border-white/5">
                        <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-400" />
                            {isAr ? 'آخر 100 نشاط' : 'Last 100 Activities'}
                        </h3>
                    </div>
                    <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                        {usageLogs.map((log, idx) => {
                            const logUser = users.find(u => u.id === log.user_id);
                            const actionColors = {
                                generate: '#818cf8', usage_generate: '#818cf8',
                                brainstorm: '#34d399', usage_brainstorm: '#34d399',
                                extract: '#38bdf8', usage_extract: '#38bdf8',
                                trend_search: '#fb923c', usage_trend_search: '#fb923c',
                            };
                            const color = actionColors[log.action_type] || '#818cf8';

                            return (
                                <div key={idx} className={`px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                                    <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                                        <p className="text-sm text-zinc-300 truncate">
                                            <span className="font-medium">{logUser?.display_name || logUser?.email?.split('@')[0] || 'Unknown'}</span>
                                            <span className="text-zinc-500 mx-2">→</span>
                                            <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: `${color}15`, color }}>{log.action_type}</span>
                                        </p>
                                        {log.input_summary && (
                                            <p className="text-[11px] text-zinc-600 truncate mt-0.5">{log.input_summary}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className="text-[11px] text-zinc-600">
                                            -{log.credits_consumed || 0} cr
                                        </span>
                                        <span className="text-[11px] text-zinc-600">
                                            {log.created_at ? new Date(log.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                        {log.success === false && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">Failed</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {usageLogs.length === 0 && (
                            <div className="px-4 py-12 text-center text-zinc-500">
                                {isAr ? 'لا يوجد نشاط بعد' : 'No activity yet'}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
