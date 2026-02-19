// src/components/secretvault/SecretVault.jsx
import React, { useState, useMemo, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { VAULT_CATEGORIES, VAULT_PROMPTS } from './vaultData';
import {
    Search, Copy, Check, Star, Filter, X, Eye,
    ChevronDown, Sparkles, Lock, ArrowRight
} from 'lucide-react';

// ═══════════════════════════════════════
// PROMPT CARD
// ═══════════════════════════════════════
const PromptCard = ({ prompt, category, isArabic, onPreview }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(prompt.prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* fallback */ }
    };

    return (
        <div
            className="group relative rounded-2xl p-5 transition-all duration-300 hover:translate-y-[-3px] cursor-pointer overflow-hidden"
            style={{
                background: 'var(--overlay-2)',
                border: '1px solid var(--border-color)',
            }}
            onClick={() => onPreview(prompt)}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = category.bg;
                e.currentTarget.style.borderColor = `${category.color}33`;
                e.currentTarget.style.boxShadow = `0 8px 30px ${category.color}15`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--overlay-2)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Top shine */}
            <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(to right, transparent, ${category.color}66, transparent)` }} />

            {/* Header */}
            <div className={`flex items-start justify-between mb-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-1 ${isArabic ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: `${category.color}20`, color: category.color }}>
                            {isArabic ? category.labelAr : category.labelEn}
                        </span>
                    </div>
                    <h3 className="text-sm font-bold text-text1 mt-2">
                        {isArabic ? prompt.titleAr : prompt.titleEn}
                    </h3>
                    <p className="text-[11px] font-medium mt-0.5" style={{ color: category.color }}>
                        {isArabic ? prompt.titleEn : prompt.titleAr}
                    </p>
                </div>
                {/* Impact Stars */}
                <div className="flex items-center gap-0.5 flex-shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3" fill={i < prompt.impact ? '#f59e0b' : 'transparent'}
                            style={{ color: i < prompt.impact ? '#f59e0b' : 'var(--star-empty)' }} />
                    ))}
                </div>
            </div>

            {/* Use Case */}
            <p className={`text-xs text-zinc-500 leading-relaxed mb-4 ${isArabic ? 'text-right' : ''}`}>
                {isArabic ? prompt.useCase.ar : prompt.useCase.en}
            </p>

            {/* Preview snippet */}
            <div className="rounded-lg p-2.5 mb-3" style={{ background: 'var(--overlay-4)' }}>
                <p className="text-[10px] text-zinc-500 font-mono line-clamp-3 leading-relaxed" dir="ltr">
                    {prompt.prompt.substring(0, 150)}...
                </p>
            </div>

            {/* Actions */}
            <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                    style={{
                        background: copied ? 'rgba(34,197,94,0.15)' : `${category.color}15`,
                        color: copied ? '#22c55e' : category.color,
                        border: `1px solid ${copied ? 'rgba(34,197,94,0.2)' : `${category.color}25`}`,
                    }}
                >
                    {copied ? <><Check className="w-3 h-3" /> {isArabic ? 'تم النسخ!' : 'Copied!'}</> :
                        <><Copy className="w-3 h-3" /> {isArabic ? 'نسخ' : 'Copy'}</>}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onPreview(prompt); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                    style={{
                        background: 'var(--overlay-5)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-color)',
                    }}
                >
                    <Eye className="w-3 h-3" /> {isArabic ? 'عرض' : 'Preview'}
                </button>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════
// PROMPT PREVIEW MODAL
// ═══════════════════════════════════════
const PreviewModal = ({ prompt, category, isArabic, onClose }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt.prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* fallback */ }
    };

    React.useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
                style={{
                    background: 'var(--modal-bg)',
                    border: `1px solid ${category.color}30`,
                    boxShadow: `var(--dropdown-shadow), 0 0 40px ${category.color}10`,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/5"
                    style={{ background: `${category.color}08` }}>
                    <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <span className="text-2xl">{category.icon}</span>
                        <div className={isArabic ? 'text-right' : ''}>
                            <h2 className="text-base font-bold text-text1">
                                {isArabic ? prompt.titleAr : prompt.titleEn}
                            </h2>
                            <p className="text-xs mt-0.5" style={{ color: category.color }}>
                                {isArabic ? prompt.titleEn : prompt.titleAr}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleCopy}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                            style={{
                                background: copied ? 'rgba(34,197,94,0.2)' : `linear-gradient(135deg, ${category.color}, ${category.color}cc)`,
                                color: copied ? '#22c55e' : '#fff',
                            }}>
                            {copied ? <><Check className="w-3.5 h-3.5" /> {isArabic ? 'تم النسخ!' : 'Copied!'}</> :
                                <><Copy className="w-3.5 h-3.5" /> {isArabic ? 'نسخ البرومبت' : 'Copy Prompt'}</>}
                        </button>
                        <button onClick={onClose}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                            <X className="w-4 h-4 text-zinc-400" />
                        </button>
                    </div>
                </div>

                {/* Use Case */}
                <div className={`px-5 py-3 flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}
                    style={{ background: 'var(--overlay-4)' }}>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <p className="text-xs text-zinc-400">
                        <span className="font-bold text-zinc-300">{isArabic ? 'متى تستخدمه: ' : 'Use case: '}</span>
                        {isArabic ? prompt.useCase.ar : prompt.useCase.en}
                    </p>
                    <div className="flex items-center gap-0.5 flex-shrink-0 mr-auto">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3 h-3" fill={i < prompt.impact ? '#f59e0b' : 'transparent'}
                                style={{ color: i < prompt.impact ? '#f59e0b' : 'var(--star-empty)' }} />
                        ))}
                    </div>
                </div>

                {/* Prompt Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    <pre className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap font-mono"
                        dir="ltr" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '12px' }}>
                        {prompt.prompt}
                    </pre>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════
// MAIN SECRET VAULT COMPONENT
// ═══════════════════════════════════════
const SecretVault = () => {
    const { language, isRTL } = useAppContext();
    const isArabic = language === 'ar';
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [previewPrompt, setPreviewPrompt] = useState(null);

    const filteredPrompts = useMemo(() => {
        let results = VAULT_PROMPTS;
        if (activeCategory !== 'all') {
            results = results.filter(p => p.category === activeCategory);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            results = results.filter(p =>
                p.titleEn.toLowerCase().includes(q) ||
                p.titleAr.includes(q) ||
                p.prompt.toLowerCase().includes(q) ||
                p.useCase.en.toLowerCase().includes(q) ||
                p.useCase.ar.includes(q)
            );
        }
        return results;
    }, [activeCategory, searchQuery]);

    const categoryMap = useMemo(() => {
        const map = {};
        VAULT_CATEGORIES.forEach(c => { map[c.id] = c; });
        return map;
    }, []);

    const previewCategory = previewPrompt ? categoryMap[previewPrompt.category] : null;

    return (
        <div className="w-full pb-8" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Hero */}
            <div className="relative rounded-2xl overflow-hidden mb-6" style={{ minHeight: 160 }}>
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0f172a 50%, #0c1222 100%)' }} />
                <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.4), transparent 70%)' }} />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)' }} />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

                <div className="relative z-10 p-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                        style={{
                            background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(139,92,246,0.1))',
                            border: '1px solid rgba(245,158,11,0.25)',
                        }}>
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs font-bold text-amber-300">{isArabic ? 'حصري' : 'EXCLUSIVE'}</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                        <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-violet-400 bg-clip-text text-transparent">
                            {isArabic ? '🔐 المكتبة السرية' : '🔐 Secret Vault'}
                        </span>
                    </h1>
                    <p className="text-sm text-zinc-400 max-w-lg mx-auto">
                        {isArabic
                            ? 'مجموعة نخبوية من أقوى البرومبتات المصممة بعناية — جاهزة للنسخ والاستخدام فوراً'
                            : 'An elite collection of the most powerful, carefully crafted prompts — ready to copy and use instantly'}
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-3 text-xs text-zinc-500">
                        <span>{VAULT_PROMPTS.length} {isArabic ? 'برومبت' : 'Prompts'}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                        <span>{VAULT_CATEGORIES.length} {isArabic ? 'مجال' : 'Categories'}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                        <span>⭐ {isArabic ? 'أعلى تأثير' : 'High Impact'}</span>
                    </div>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className={`flex items-center gap-3 mb-5 flex-wrap ${isArabic ? 'flex-row-reverse' : ''}`}>
                {/* Search */}
                <div className={`flex-1 min-w-[200px] relative ${isArabic ? 'text-right' : ''}`}>
                    <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 ${isArabic ? 'right-3' : 'left-3'}`} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isArabic ? 'ابحث في البرومبتات...' : 'Search prompts...'}
                        className="w-full h-10 rounded-xl text-sm text-zinc-300 placeholder-zinc-600"
                        style={{
                            background: 'var(--overlay-4)',
                            border: '1px solid var(--border-color)',
                            paddingLeft: isArabic ? '12px' : '36px',
                            paddingRight: isArabic ? '36px' : '12px',
                        }}
                        dir={isArabic ? 'rtl' : 'ltr'}
                    />
                </div>

                {/* Category count */}
                <span className="text-xs text-zinc-500 font-medium px-2">
                    {filteredPrompts.length} {isArabic ? 'نتيجة' : 'results'}
                </span>
            </div>

            {/* Category Pills */}
            <div className={`flex items-center gap-2 mb-6 overflow-x-auto pb-2 ${isArabic ? 'flex-row-reverse' : ''}`}
                style={{ scrollbarWidth: 'thin' }}>
                <button
                    onClick={() => setActiveCategory('all')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
                    style={{
                        background: activeCategory === 'all' ? 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.15))' : 'var(--overlay-4)',
                        border: `1px solid ${activeCategory === 'all' ? 'rgba(139,92,246,0.3)' : 'var(--border-color)'}`,
                        color: activeCategory === 'all' ? '#c084fc' : 'var(--text-muted)',
                    }}
                >
                    <Filter className="w-3 h-3" />
                    {isArabic ? 'الكل' : 'All'}
                </button>
                {VAULT_CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    const count = VAULT_PROMPTS.filter(p => p.category === cat.id).length;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
                            style={{
                                background: isActive ? `${cat.color}15` : 'var(--overlay-4)',
                                border: `1px solid ${isActive ? `${cat.color}30` : 'var(--border-color)'}`,
                                color: isActive ? cat.color : 'var(--text-muted)',
                            }}
                        >
                            <span>{cat.icon}</span>
                            {isArabic ? cat.labelAr : cat.labelEn}
                            <span className="text-[10px] opacity-60">({count})</span>
                        </button>
                    );
                })}
            </div>

            {/* Prompts Grid */}
            {filteredPrompts.length === 0 ? (
                <div className="text-center py-16">
                    <Search className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                    <p className="text-sm text-zinc-500">
                        {isArabic ? 'لا توجد نتائج' : 'No prompts found'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPrompts.map((prompt) => (
                        <PromptCard
                            key={prompt.id}
                            prompt={prompt}
                            category={categoryMap[prompt.category]}
                            isArabic={isArabic}
                            onPreview={setPreviewPrompt}
                        />
                    ))}
                </div>
            )}

            {/* Preview Modal */}
            {previewPrompt && previewCategory && (
                <PreviewModal
                    prompt={previewPrompt}
                    category={previewCategory}
                    isArabic={isArabic}
                    onClose={() => setPreviewPrompt(null)}
                />
            )}
        </div>
    );
};

export default SecretVault;
