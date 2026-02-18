import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import {
    Type, Users, Film, Clock, Palette, Sparkles, Loader2, Check, UserCircle,
    Mic, Languages, Wand2, Volume2, Maximize, Hash, Zap, ShieldAlert,
    Lightbulb, RefreshCw, BookOpen, Target, ChevronDown, Plus, X, Settings2
} from 'lucide-react';
import { generate_prompt, brainstorm_concept } from '../../api/promptApi';
import HelpTooltip from '../ui/HelpTooltip';

// ── UI Primitives ──────────────────────────────────────

const Toggle = ({ active, onChange, purple }) => (
    <button onClick={() => onChange?.(!active)}
        className={`relative w-9 h-5 rounded-full transition-all duration-200 ${active ? purple ? 'bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'bg-primary shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'bg-border'}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 shadow-sm ${active ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
);

const VisualSelector = ({ options = [], value, onChange, isRTL }) => (
    <div className="flex flex-wrap gap-1.5" dir={isRTL ? 'rtl' : 'ltr'}>
        {options.map((opt) => {
            const v = opt?.value || opt; const l = opt?.label || opt; return (
                <button key={v} onClick={() => onChange?.(v)} className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 border ${value === v ? 'bg-primary/20 border-primary/40 text-primary shadow-sm shadow-primary/10' : 'bg-bg1/50 border-border text-text2 hover:bg-bg1 hover:text-text1'}`}>{l}</button>
            );
        })}
    </div>
);

const FormField = ({ label, icon: Icon, children, isRTL, helpText }) => (
    <div>
        <div className={`flex items-center gap-1.5 mb-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {Icon && <Icon className="w-3 h-3 text-muted" />}
            <span className="text-[11px] font-semibold text-text2 uppercase tracking-wide">{label}</span>
            {helpText && <HelpTooltip text={helpText} />}
        </div>
        {children}
    </div>
);

const TextInput = ({ value, onChange, placeholder, type = 'text' }) => (
    <input type={type} value={value || ''} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
        className="h-9 w-full rounded-lg bg-bg1 border border-border dark:border-white/[0.08] px-3 text-[13px] text-text1 placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/25"
        dir="auto" min={type === 'number' ? 1 : undefined} max={type === 'number' ? 20 : undefined} />
);

const TextArea = ({ value, onChange, placeholder, rows = 3 }) => (
    <textarea value={value || ''} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full rounded-lg bg-bg1 border border-border dark:border-white/[0.08] px-3 py-2 text-[13px] text-text1 placeholder-muted outline-none transition-all resize-none focus:border-primary focus:ring-2 focus:ring-primary/25"
        dir="auto" />
);

const Select = ({ value = '', onChange, options = [], isRTL, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const triggerRef = useRef(null);
    const searchRef = useRef(null);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
    useEffect(() => { if (isOpen && triggerRef.current) { const r = triggerRef.current.getBoundingClientRect(); setMenuPos({ top: r.bottom + 4, left: r.left, width: r.width }); } if (isOpen) { setFilter(''); setTimeout(() => searchRef.current?.focus(), 50); } }, [isOpen]);
    useEffect(() => { if (!isOpen) return; const onKey = (e) => { if (e.key === 'Escape') setIsOpen(false); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [isOpen]);
    const getLabel = () => { if (!value) return ''; for (const opt of options) { if (opt.group && opt.items) { const f = opt.items.find(i => i.value === value); if (f) return f.label || f.value; } else if (opt.value === value) return opt.label || opt.value; } return value; };
    const handleSelect = (val) => { onChange(val); setIsOpen(false); };
    const groupGradients = ['from-blue-500/10 to-indigo-500/10', 'from-emerald-500/10 to-teal-500/10', 'from-orange-500/10 to-amber-500/10', 'from-purple-500/10 to-pink-500/10', 'from-cyan-500/10 to-sky-500/10', 'from-rose-500/10 to-red-500/10'];

    // Count total options for search threshold
    const totalOpts = options.reduce((n, o) => n + (o.group && o.items ? o.items.length : 1), 0);
    const showSearch = totalOpts >= 6;
    const f = filter.toLowerCase();

    // Filter options
    const filteredOptions = f ? options.map(opt => {
        if (opt.group && opt.items) {
            const fi = opt.items.filter(i => (i.label || i.value || '').toLowerCase().includes(f));
            return fi.length > 0 ? { ...opt, items: fi } : null;
        }
        return (opt.label || opt.value || '').toLowerCase().includes(f) ? opt : null;
    }).filter(Boolean) : options;

    return (
        <div className="relative">
            <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)} className={`h-9 w-full rounded-lg bg-bg1 border px-3 text-[13px] flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'border-primary ring-2 ring-primary/25' : 'border-border dark:border-white/[0.08]'}`} dir="auto">
                <span className={`truncate ${!getLabel() && placeholder ? 'text-muted' : 'text-text1'}`}>{getLabel() || placeholder || (options[0]?.label || (isRTL ? 'اختر...' : 'Select...'))}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-muted flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && ReactDOM.createPortal(<><div className="fixed inset-0 z-[9990]" onClick={() => setIsOpen(false)} />
                <div className="fixed z-[9991] rounded-xl shadow-[0_12px_28px_rgba(0,0,0,0.35)] max-h-[320px] overflow-hidden flex flex-col animate-scale-in" style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width, background: '#151C31', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(6px)' }}>
                    {showSearch && (
                        <div className="sticky top-0 z-10 px-2 pt-2 pb-1.5" style={{ background: '#151C31', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <input ref={searchRef} type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder={isRTL ? '🔍 بحث...' : '🔍 Search...'} className="w-full h-7 px-2.5 rounded-md text-xs text-white placeholder-white/30 outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }} dir="auto" />
                        </div>
                    )}
                    <div className="overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {filteredOptions.length === 0 && <div className="px-3 py-4 text-xs text-white/30 text-center">{isRTL ? 'لا توجد نتائج' : 'No results'}</div>}
                        {filteredOptions.map((opt, idx) => {
                            if (opt.group && opt.items) {
                                const gc = groupGradients[idx % groupGradients.length]; return (
                                    <div key={idx} className={`mb-2 rounded-lg border border-white/5 overflow-hidden bg-gradient-to-br ${gc}`}>
                                        <div className="px-3 py-1.5 text-[10px] font-bold text-white/50 uppercase tracking-wider bg-black/20 border-b border-white/5">{opt.group}</div>
                                        <div className="p-1">{opt.items.map((item, i) => (
                                            <div key={i} onClick={() => handleSelect(item.value)} className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-all duration-150 flex items-center justify-between ${value === item.value ? 'bg-primary/20 text-primary font-semibold' : 'text-text2 hover:bg-[rgba(108,92,255,0.12)] hover:text-white'}`}>
                                                <span>{item.label || item.value}</span>{value === item.value && <Check className="w-3.5 h-3.5" />}
                                            </div>
                                        ))}</div>
                                    </div>);
                            }
                            return (<div key={idx} onClick={() => handleSelect(opt.value)} className={`px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-all duration-150 flex items-center justify-between mb-1 ${value === opt.value ? 'bg-primary/20 text-primary font-semibold' : 'text-text2 hover:bg-[rgba(108,92,255,0.12)] hover:text-white'}`}>
                                <span>{opt.label || opt.value}</span>{value === opt.value && <Check className="w-3.5 h-3.5" />}
                            </div>);
                        })}
                    </div>
                </div></>, document.body)}
        </div>
    );
};

export { Toggle, VisualSelector, FormField, TextInput, TextArea, Select };
export default Select;
