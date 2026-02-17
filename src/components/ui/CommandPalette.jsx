import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import {
    Home, Sparkles, Globe, Flame, Wand2, Lock,
    DollarSign, Info, Briefcase, Mail, Search, X
} from 'lucide-react';

const allCommands = [
    { id: 'home', icon: Home, color: '#8b5cf6' },
    { id: 'generator', icon: Sparkles, color: '#3b82f6' },
    { id: 'extractor', icon: Globe, color: '#0ea5e9' },
    { id: 'trendhunter', icon: Flame, color: '#6366f1' },
    { id: 'promptarchitect', icon: Wand2, color: '#8b5cf6' },
    { id: 'secretvault', icon: Lock, color: '#f59e0b' },
    { id: 'pricing', icon: DollarSign, color: '#10b981' },
    { id: 'about', icon: Info, color: '#64748b' },
    { id: 'services', icon: Briefcase, color: '#6366f1' },
    { id: 'contact', icon: Mail, color: '#ec4899' },
];

const labelMap = {
    home: { en: 'Home', ar: 'الرئيسية' },
    generator: { en: 'Creative Studio', ar: 'استوديو الإبداع' },
    extractor: { en: 'Prompt Extractor', ar: 'مستخرج البرومبت' },
    trendhunter: { en: 'Trend Hunter', ar: 'صائد الترندات' },
    promptarchitect: { en: 'Prompt Architect', ar: 'مهندس البرومبت' },
    secretvault: { en: 'Secret Vault', ar: 'المكتبة السرية' },
    pricing: { en: 'Pricing', ar: 'الأسعار' },
    about: { en: 'About', ar: 'عنّا' },
    services: { en: 'Services', ar: 'الخدمات' },
    contact: { en: 'Contact', ar: 'تواصل معنا' },
};

const CommandPalette = () => {
    const { setActiveTab, language } = useAppContext();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIdx, setSelectedIdx] = useState(0);
    const inputRef = useRef(null);

    const isAr = language === 'ar';

    // Global Ctrl+K listener
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(prev => !prev);
            }
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // Auto-focus input when opening
    useEffect(() => {
        if (open) {
            setQuery('');
            setSelectedIdx(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    // Filter commands
    const filtered = allCommands.filter(cmd => {
        if (!query) return true;
        const q = query.toLowerCase();
        const label = labelMap[cmd.id];
        return cmd.id.includes(q) || label.en.toLowerCase().includes(q) || label.ar.includes(q);
    });

    // Reset selection when filter changes
    useEffect(() => { setSelectedIdx(0); }, [query]);

    const handleSelect = useCallback((id) => {
        setActiveTab(id);
        setOpen(false);
    }, [setActiveTab]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIdx(prev => Math.min(prev + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIdx(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && filtered[selectedIdx]) {
            handleSelect(filtered[selectedIdx].id);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl"
                style={{
                    background: 'var(--bg-surface, #1e1e2e)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    animation: 'pageEnter 0.2s ease-out',
                }}
            >
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <Search className="w-5 h-5 text-muted flex-shrink-0" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isAr ? 'ابحث عن أداة أو صفحة...' : 'Search tools & pages...'}
                        className="flex-1 bg-transparent text-text1 text-sm outline-none placeholder:text-muted"
                        dir={isAr ? 'rtl' : 'ltr'}
                    />
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded border text-muted"
                        style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
                        ESC
                    </kbd>
                    <button onClick={() => setOpen(false)} className="text-muted hover:text-text1 transition-colors sm:hidden">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto py-2">
                    {filtered.length === 0 ? (
                        <div className="px-4 py-8 text-center text-muted text-sm">
                            {isAr ? 'مفيش نتائج' : 'No results found'}
                        </div>
                    ) : (
                        filtered.map((cmd, i) => {
                            const Icon = cmd.icon;
                            const label = labelMap[cmd.id];
                            const isSelected = i === selectedIdx;
                            return (
                                <button
                                    key={cmd.id}
                                    onClick={() => handleSelect(cmd.id)}
                                    onMouseEnter={() => setSelectedIdx(i)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${isSelected ? 'bg-white/5' : 'hover:bg-white/3'
                                        }`}
                                    style={{ direction: isAr ? 'rtl' : 'ltr' }}
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: `${cmd.color}18` }}
                                    >
                                        <Icon className="w-4 h-4" style={{ color: cmd.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-text1 truncate">{isAr ? label.ar : label.en}</p>
                                    </div>
                                    {isSelected && (
                                        <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded text-muted"
                                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                            ↵
                                        </kbd>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Footer hint */}
                <div className="px-4 py-2 border-t flex items-center gap-4 text-[10px] text-muted"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <span className="flex items-center gap-1">
                        <kbd style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '1px 4px', borderRadius: '3px' }}>↑↓</kbd>
                        {isAr ? 'تنقل' : 'Navigate'}
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '1px 4px', borderRadius: '3px' }}>↵</kbd>
                        {isAr ? 'اختر' : 'Select'}
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '1px 4px', borderRadius: '3px' }}>Esc</kbd>
                        {isAr ? 'إغلاق' : 'Close'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
