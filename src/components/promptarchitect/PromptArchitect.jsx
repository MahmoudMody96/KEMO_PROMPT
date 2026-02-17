// src/components/promptarchitect/PromptArchitect.jsx
// Prompt Architect v5.0 — Advanced Prompt Engineering Engine
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { engineer_universal_prompt, refine_prompt, simulate_prompt } from '../../api/promptApi';
import { content, colorMap, iconMap } from './promptArchitectData';
import { getTemplatesByDomain, searchTemplates, fillTemplate } from '../../api/promptTemplates';
import { getAllStrategies, getStrategy, applyStrategy, autoDetectStrategy } from '../../api/promptStrategies';
import CustomSelect from '../ui/CustomSelect';
import HelpTooltip from '../ui/HelpTooltip';
import {
    Wand2, Copy, Check, Loader2, Sparkles,
    Code, Globe, RefreshCw, Play, Shield, FileText, Zap,
    AlertTriangle, ToggleRight, ToggleLeft,
    BookOpen, X, Search, ChevronDown, ChevronRight,
    Star, Flame, Brain, ArrowRight, Trash2,
    Download, Lightbulb, GitCompare, Plus, Save, FolderOpen
} from 'lucide-react';

// PROMPT SCORING ENGINE
// ============================================
const scorePrompt = (task, domainParams, constraints, factCheck, strategy, rawData) => {
    let score = 0;
    let tips = [];

    // Task quality (0-30)
    if (task.length > 10) score += 10;
    if (task.length > 50) score += 10;
    if (task.length > 100) score += 10;
    else tips.push({ en: 'Make your task description more detailed', ar: 'اجعل وصف المهمة أكثر تفصيلاً' });

    // Domain context (0-20)
    const filledParams = Object.values(domainParams || {}).filter(v => v).length;
    score += Math.min(filledParams * 7, 20);
    if (filledParams < 2) tips.push({ en: 'Fill in more domain context fields', ar: 'املأ المزيد من حقول السياق' });

    // Raw data / context (0-15)
    if (rawData && rawData.length > 10) score += 8;
    if (rawData && rawData.length > 100) score += 7;
    else tips.push({ en: 'Paste code, data, or context for better results', ar: 'الصق كود أو بيانات أو سياق لنتائج أفضل' });

    // Constraints (0-15)
    if (constraints && constraints.length > 5) score += 10;
    if (constraints && constraints.length > 30) score += 5;
    else tips.push({ en: 'Add negative constraints for better results', ar: 'أضف قيود سلبية لنتائج أفضل' });

    // Fact check (0-5)
    if (factCheck) score += 5;

    // Strategy (0-15)
    if (strategy && strategy !== 'zero_shot') score += 10;
    if (strategy === 'chain_of_thought' || strategy === 'tree_of_thought') score += 5;
    else tips.push({ en: 'Select an advanced strategy like Chain-of-Thought', ar: 'اختر استراتيجية متقدمة مثل Chain-of-Thought' });

    return { score: Math.min(score, 100), tips };
};

const getScoreInfo = (score, t) => {
    if (score >= 85) return { label: t?.excellent || 'Excellent', color: '#22c55e', emoji: '🔥' };
    if (score >= 60) return { label: t?.strong || 'Strong', color: '#3b82f6', emoji: '💪' };
    if (score >= 35) return { label: t?.medium || 'Medium', color: '#f59e0b', emoji: '⚡' };
    return { label: t?.weak || 'Weak', color: '#ef4444', emoji: '📝' };
};


// ============================================
// MAIN COMPONENT
// ============================================
const PromptArchitect = () => {
    const { language } = useAppContext();
    const lang = language || 'en';
    const isArabic = lang === 'ar';
    const textDir = isArabic ? 'rtl' : 'ltr';
    const flexDir = isArabic ? 'row-reverse' : 'row';

    const t = useMemo(() => {
        const dict = content[lang] || content.en;
        if (!dict || !dict.domains || !dict.fields) return content.en;
        return dict;
    }, [lang]);

    // ── State ──
    const [domain, setDomain] = useState('software');
    const [domainParams, setDomainParams] = useState({});
    const [task, setTask] = useState('');
    const [rawData, setRawData] = useState('');
    const [constraints, setConstraints] = useState('');
    const [factCheckMode, setFactCheckMode] = useState(false);
    const [selectedStrategy, setSelectedStrategy] = useState('auto');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [simulatedOutput, setSimulatedOutput] = useState('');
    const [showSimulation, setShowSimulation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);
    // Progress bar state
    const [progressStep, setProgressStep] = useState(0);
    const progressTimerRef = useRef(null);
    // Modals
    const [showTemplates, setShowTemplates] = useState(false);
    const [templateSearch, setTemplateSearch] = useState('');
    // v5.0 Features
    const [previousPrompt, setPreviousPrompt] = useState('');
    const [showDiff, setShowDiff] = useState(false);
    const [showAllStrategies, setShowAllStrategies] = useState(false);
    const [customTemplates, setCustomTemplates] = useState([]);
    const [showCustomSave, setShowCustomSave] = useState(false);
    const [customTemplateName, setCustomTemplateName] = useState('');
    const [abMode, setAbMode] = useState(false);
    const [abPromptB, setAbPromptB] = useState('');
    const [isLoadingB, setIsLoadingB] = useState(false);
    const taskRef = useRef(null);

    // Progress bar phases
    const progressPhases = useMemo(() => isArabic ? [
        { label: 'تحليل المهمة...', pct: 15 },
        { label: 'تجميع سياق المجال...', pct: 35 },
        { label: 'بناء البرومبت...', pct: 55 },
        { label: 'حقن الاستراتيجية...', pct: 75 },
        { label: 'تحسين وصقل...', pct: 90 },
    ] : [
        { label: 'Analyzing task...', pct: 15 },
        { label: 'Compiling domain context...', pct: 35 },
        { label: 'Building prompt structure...', pct: 55 },
        { label: 'Injecting strategy...', pct: 75 },
        { label: 'Polishing & optimizing...', pct: 90 },
    ], [isArabic]);

    // Load custom templates on mount
    useEffect(() => {
        try { setCustomTemplates(JSON.parse(localStorage.getItem('pa_custom_templates') || '[]')); } catch { }
    }, []);

    // ── Keyboard Shortcuts + Escape handler for modals ──
    useEffect(() => {
        const handler = (e) => {
            if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); if (task.trim() && !isLoading) handleGenerate(); }
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'r') { e.preventDefault(); if (generatedPrompt && !isRefining) handleRefine(); }
            if (e.key === 'Escape') { setShowTemplates(false); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [task, isLoading, generatedPrompt, isRefining]);

    // ── Derived ──
    const currentDomain = t.domains?.find(d => d.id === domain) || t.domains?.[0];
    const currentFields = t.fields?.[domain] || [];
    const domainColor = colorMap[domain] || colorMap.general;
    const DomainIcon = iconMap[domain] || Globe;
    const strategies = getAllStrategies();
    const resolvedStrategy = selectedStrategy === 'auto' ? autoDetectStrategy(task, domain) : selectedStrategy;

    // Prepare strategy options for CustomSelect
    const strategyOptions = useMemo(() => [
        { value: 'auto', label: `${t.autoDetect}`, icon: '✨', description: isArabic ? 'يكتشف أفضل استراتيجية تلقائياً حسب المهمة' : 'Auto-detects the best strategy based on your task' },
        ...strategies.map(s => ({
            value: s.id,
            label: s.name[lang] || s.name.en,
            icon: s.icon,
            description: s.when?.[lang] || s.when?.en || '',
            badge: s.difficulty || 'beginner'
        }))
    ], [strategies, lang, t.autoDetect, isArabic]);

    const { score: promptScore, tips: scoreTips } = scorePrompt(task, domainParams, constraints, factCheckMode, resolvedStrategy, rawData);
    const scoreInfo = getScoreInfo(promptScore, t);
    const filledParams = Object.values(domainParams).filter(v => v).length;
    const totalParams = currentFields.length;
    const hasTask = task.trim().length > 0;

    // ── Handlers ──
    const handleDomainChange = (newDomain) => { setDomain(newDomain); setDomainParams({}); };
    const handleParamChange = (key, value) => setDomainParams(prev => ({ ...prev, [key]: value }));

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleGenerate = async () => {
        if (!task.trim()) return;
        setIsLoading(true); setSimulatedOutput(''); setShowSimulation(false); setError(null); setShowDiff(false);
        // Start progress animation
        setProgressStep(0);
        let step = 0;
        progressTimerRef.current = setInterval(() => {
            step++;
            if (step < 5) setProgressStep(step);
        }, 2200);
        if (abMode) setIsLoadingB(true);
        try {
            const config = {
                mode: 'smart-domain-v2', domain, domainParams, task, rawData, constraints,
                factCheckMode, userLang: lang, strategy: resolvedStrategy,
            };
            const result = await engineer_universal_prompt(config);
            if (!result) throw new Error('Empty result');
            if (result.error) throw new Error(result.error);
            const promptText = typeof result === 'string' ? result : result.engineered_prompt || result.prompt || JSON.stringify(result, null, 2);
            // Strip markdown code fences the AI wraps its output in
            const cleanedPrompt = promptText
                .replace(/^\s*```(?:markdown)?\s*\n?/i, '')
                .replace(/\n?\s*```\s*$/i, '')
                .trim();
            setGeneratedPrompt(cleanedPrompt);

            // A/B: generate variant B with different strategy
            if (abMode) {
                try {
                    const altStrategy = resolvedStrategy === 'chain_of_thought' ? 'tree_of_thought' : 'chain_of_thought';
                    const resultB = await engineer_universal_prompt({ ...config, strategy: altStrategy });
                    const textB = typeof resultB === 'string' ? resultB : resultB?.engineered_prompt || resultB?.prompt || '';
                    setAbPromptB(textB);
                } catch { setAbPromptB('Variant B generation failed.'); }
                finally { setIsLoadingB(false); }
            }
        } catch (err) {
            console.error('Generation Failed:', err);
            setError(isArabic ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'Generation failed. Please try again.');
        } finally {
            setIsLoading(false);
            if (abMode) setIsLoadingB(false);
            clearInterval(progressTimerRef.current);
            setProgressStep(0);
        }
    };

    const handleRefine = async () => {
        if (!generatedPrompt) return;
        setPreviousPrompt(generatedPrompt);
        setIsRefining(true);
        try {
            const result = await refine_prompt(generatedPrompt, domain, 'auto');
            if (result && !result.error) {
                const refined = typeof result === 'string' ? result : result.refined_prompt || JSON.stringify(result, null, 2);
                setGeneratedPrompt(refined);
                setShowDiff(true);
            }
        } catch (err) { console.error('Refinement Error:', err); }
        finally { setIsRefining(false); }
    };

    const handleSimulate = async () => {
        if (!generatedPrompt) return;
        setIsSimulating(true); setShowSimulation(true);
        try {
            const result = await simulate_prompt(generatedPrompt);
            if (result && !result.error) setSimulatedOutput(typeof result === 'string' ? result : result.simulation || JSON.stringify(result, null, 2));
        } catch (err) { setSimulatedOutput('Simulation failed.'); }
        finally { setIsSimulating(false); }
    };

    const handleUseTemplate = (tmpl) => {
        setTask(tmpl.template);
        // Also set domain if template has a domain context
        if (tmpl.domain) {
            setDomain(tmpl.domain);
            setDomainParams({});
        }
        setShowTemplates(false);
    };

    // ── Export ──
    const handleExport = (format) => {
        const metadata = `Domain: ${domain}\nStrategy: ${resolvedStrategy}\nScore: ${promptScore}%\nDate: ${new Date().toLocaleString()}\n\n---\n\n`;
        const exportContent = format === 'md' ? `# Prompt Architect Output\n\n${metadata}${generatedPrompt}` : generatedPrompt;
        const blob = new Blob([exportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `prompt-${domain}-${Date.now()}.${format}`; a.click();
        URL.revokeObjectURL(url);
    };

    // ── Custom Templates ──
    const handleSaveCustomTemplate = () => {
        if (!customTemplateName.trim() || !task.trim()) return;
        const newTmpl = { id: `custom_${Date.now()}`, title: customTemplateName, template: task, domain, created: new Date().toISOString() };
        const updated = [newTmpl, ...customTemplates];
        setCustomTemplates(updated);
        localStorage.setItem('pa_custom_templates', JSON.stringify(updated));
        setShowCustomSave(false); setCustomTemplateName('');
    };

    const handleDeleteCustomTemplate = (id) => {
        const updated = customTemplates.filter(ct => ct.id !== id);
        setCustomTemplates(updated);
        localStorage.setItem('pa_custom_templates', JSON.stringify(updated));
    };

    // ── Diff computation ──
    const computeDiff = (oldText, newText) => {
        if (!oldText || !newText) return [];
        const oldLines = oldText.split('\n');
        const newLines = newText.split('\n');
        const result = [];
        const max = Math.max(oldLines.length, newLines.length);
        for (let i = 0; i < max; i++) {
            if (i >= oldLines.length) result.push({ type: 'added', text: newLines[i] });
            else if (i >= newLines.length) result.push({ type: 'removed', text: oldLines[i] });
            else if (oldLines[i] !== newLines[i]) { result.push({ type: 'removed', text: oldLines[i] }); result.push({ type: 'added', text: newLines[i] }); }
            else result.push({ type: 'same', text: oldLines[i] });
        }
        return result;
    };

    // ── Safety check ──
    if (!t || !t.domains || !Array.isArray(t.domains) || t.domains.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-text1">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
        );
    }

    // ── Domain fields renderer ──
    const renderDomainFields = () => {
        if (!currentFields || currentFields.length === 0) return null;
        return (
            <div className="p-3 rounded-lg border grid grid-cols-3 gap-x-3 gap-y-2" style={{ backgroundColor: domainColor.bg, borderColor: domainColor.border }}>
                {currentFields.map((field) => {
                    if (!field || !field.key) return null;
                    return (
                        <div key={field.key} dir={textDir}>
                            <label className="text-xs font-medium mb-1 flex items-center gap-1 text-text2">
                                {field.label}
                                {field.type !== 'select' && field.placeholder && <HelpTooltip text={field.placeholder} />}
                            </label>
                            {field.type === 'select' ? (
                                <CustomSelect
                                    value={domainParams[field.key]}
                                    onChange={(e) => handleParamChange(field.key, e.target.value)}
                                    options={field.options}
                                    placeholder={t.selectOption}
                                    className="input-base h-9 text-sm px-2 bg-white/5 border-white/10 hover:border-white/20 transition-all text-text1"
                                />
                            ) : (
                                <input type="text" value={domainParams[field.key] || ''} onChange={(e) => handleParamChange(field.key, e.target.value)}
                                    placeholder={field.placeholder || ''}
                                    className="input-base w-full h-9 text-sm px-2 bg-white/5 border-white/10 hover:border-white/20 transition-all text-text1 placeholder:text-text3" />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    // ── Templates for current domain ──
    const domainTemplates = useMemo(() => {
        if (!showTemplates) return [];
        const tmps = templateSearch ? searchTemplates(templateSearch, lang) : getTemplatesByDomain(domain);
        return tmps || [];
    }, [showTemplates, domain, templateSearch, lang]);

    // ══════════════════════════════════════
    // RENDER
    // ══════════════════════════════════════
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-80px)]" dir="ltr" style={{ direction: 'ltr' }}>

            {/* ═══ RIGHT COLUMN: Input Panel ═══ */}
            <div className="card overflow-hidden lg:order-2 flex flex-col">
                <div className="px-3 py-2 border-b border-border flex items-center justify-between" dir={textDir} style={{ flexDirection: flexDir }}>
                    <div className="flex items-center gap-2" style={{ flexDirection: flexDir }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${domainColor.text}22`, border: `1px solid ${domainColor.text}33` }}>
                            <Sparkles className="w-3.5 h-3.5" style={{ color: domainColor.text }} />
                        </div>
                        <h3 className="font-bold text-sm text-text1">{t.nexusTitle}</h3>
                    </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between gap-3 overflow-auto" dir={textDir}>
                    {/* ── Top Section: All inputs ── */}
                    <div className="space-y-3">
                        {/* Prompt Score Bar */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-300" style={{ background: `${scoreInfo.color}15`, border: `1px solid ${scoreInfo.color}30` }}>
                            <span className="text-base filter drop-shadow-sm">{scoreInfo.emoji}</span>
                            <span className="text-xs font-bold tracking-wide" style={{ color: scoreInfo.color }}>{scoreInfo.label}</span>
                            <div className="flex-1 h-2 rounded-full bg-zinc-800/50 overflow-hidden backdrop-blur-sm">
                                <div className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,0,0,0.2)]" style={{ width: `${promptScore}%`, backgroundColor: scoreInfo.color }} />
                            </div>
                            <span className="text-xs font-bold" style={{ color: scoreInfo.color }}>{promptScore}%</span>
                        </div>
                        {/* Score Tips */}
                        {scoreTips.length > 0 && promptScore < 80 && (
                            <div className="flex flex-wrap gap-1.5">
                                {scoreTips.slice(0, 3).map((tip, i) => (
                                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400/80">
                                        💡 {isArabic ? tip.ar : tip.en}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Domain & Strategy */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative group">
                                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-2 h-2 rounded-full transition-all group-hover:scale-125 group-hover:shadow-[0_0_8px_currentColor]" style={{ backgroundColor: domainColor.text, color: domainColor.text }} />
                                <CustomSelect
                                    value={domain}
                                    onChange={(e) => handleDomainChange(e.target.value)}
                                    options={t.domains.map(d => ({
                                        value: d.id,
                                        label: d.label.replace(d.emoji || '', '').trim(),
                                        icon: d.emoji
                                    }))}
                                    className="input-base h-9 text-sm pl-7 pr-3 transition-all font-medium"
                                    style={{
                                        borderColor: `${domainColor.text}40`,
                                        background: `${domainColor.text}10`,
                                        color: isArabic ? 'inherit' : domainColor.text
                                    }}
                                />
                            </div>
                            <div className="relative group">
                                <CustomSelect
                                    value={selectedStrategy}
                                    onChange={(e) => setSelectedStrategy(e.target.value)}
                                    options={strategyOptions}
                                    title={isArabic ? 'استراتيجية التفكير' : 'Reasoning Strategy'}
                                    dropdownWidth={340}
                                    className="input-base h-9 text-sm px-3 transition-all font-medium"
                                    style={{
                                        borderColor: selectedStrategy !== 'auto' ? 'rgba(168,85,247,0.4)' : undefined,
                                        color: selectedStrategy !== 'auto' ? '#a855f7' : undefined
                                    }}
                                />
                            </div>
                        </div>

                        {/* Domain Context Fields */}
                        {renderDomainFields()}

                        {/* Core Task + Raw Data */}
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-sm font-semibold text-text1" style={{ flexDirection: flexDir }}>
                                <div className="p-1 rounded bg-blue-500/10">
                                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                                </div>
                                {t.coreTask}
                                {task.trim() && (
                                    <button onClick={() => { setShowCustomSave(true); setCustomTemplateName(''); }}
                                        className="ml-auto text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors px-2 py-0.5 rounded-full hover:bg-emerald-500/10">
                                        <Save className="w-3.5 h-3.5" /> {isArabic ? 'حفظ كقالب' : 'Save'}
                                    </button>
                                )}
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative group">
                                    <label className="label-text text-xs mb-1.5 opacity-80 group-focus-within:opacity-100 group-focus-within:text-primary transition-all flex items-center gap-1">
                                        {t.taskQuestion}
                                        <HelpTooltip text={isArabic ? 'صف المهمة المحددة التي تريد من الذكاء الاصطناعي تنفيذها' : 'Describe the exact task you want the AI to perform'} />
                                    </label>
                                    <textarea ref={taskRef} value={task} onChange={(e) => setTask(e.target.value)} placeholder={t.placeholders.task}
                                        className="input-base w-full h-28 resize-none text-sm p-3 leading-relaxed focus:ring-2 ring-primary/20 transition-all" />
                                </div>
                                <div className="relative group">
                                    <label className="label-text text-xs mb-1.5 opacity-80 group-focus-within:opacity-100 group-focus-within:text-primary transition-all flex items-center gap-1">
                                        {t.rawDataLabel}
                                        <HelpTooltip text={isArabic ? 'الصق أي كود، بيانات، أو سياق إضافي يساعد في توليد برومبت أفضل' : 'Paste any code, data, or extra context to help generate a better prompt'} />
                                    </label>
                                    <textarea value={rawData} onChange={(e) => setRawData(e.target.value)} placeholder={t.placeholders.rawData}
                                        className="input-base w-full h-28 resize-none font-mono text-xs p-3 leading-relaxed opacity-90 focus:opacity-100 transition-all" />
                                </div>
                            </div>
                            {/* Custom template save */}
                            {showCustomSave && (
                                <div className="flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <input type="text" value={customTemplateName} onChange={(e) => setCustomTemplateName(e.target.value)}
                                        placeholder={isArabic ? 'اسم القالب...' : 'Template name...'} className="input-base input-sm flex-1" />
                                    <button onClick={handleSaveCustomTemplate} className="px-2 py-1 rounded-lg text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors">
                                        <Check className="w-3 h-3" />
                                    </button>
                                    <button onClick={() => setShowCustomSave(false)} className="px-2 py-1 rounded-lg text-xs bg-zinc-800 text-zinc-400 border border-white/5 hover:bg-zinc-700 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                            {/* Custom templates list */}
                            {customTemplates.length > 0 && (
                                <div className="flex gap-1.5 flex-wrap">
                                    {customTemplates.slice(0, 5).map((ct) => (
                                        <div key={ct.id} className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/5 border border-emerald-500/15 text-[10px] text-emerald-400 group hover:border-emerald-500/30 transition-all cursor-pointer">
                                            <button onClick={() => setTask(ct.template)} className="hover:text-emerald-300 font-medium">{ct.title}</button>
                                            <button onClick={() => handleDeleteCustomTemplate(ct.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 ml-1">
                                                <X className="w-2.5 h-2.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Bottom Section: Constraints + Generate ── */}
                    <div className="space-y-3 pt-2 bg-gradient-to-t from-bg-surface via-bg-surface to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1 group">
                                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                    <Shield className="h-3.5 w-3.5 text-text-muted group-focus-within:text-primary transition-colors" />
                                </div>
                                <input type="text" value={constraints} onChange={(e) => setConstraints(e.target.value)} placeholder={t.placeholders.constraints}
                                    className="input-base h-10 text-sm pl-8 pr-8 flex-1 transition-all focus:ring-2 ring-red-500/10 focus:border-red-500/30" />
                                <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                                    <HelpTooltip text={isArabic ? 'اكتب القيود السلبية: ما الذي يجب على الذكاء الاصطناعي تجنبه؟' : 'Negative constraints: what should the AI avoid?'} />
                                </div>
                            </div>
                            <button onClick={() => setFactCheckMode(!factCheckMode)}
                                className={`flex items-center gap-1.5 text-sm cursor-pointer shrink-0 px-3 py-2 rounded-lg border transition-all ${factCheckMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-transparent border-transparent text-text-muted hover:bg-bg-hover'}`}>
                                {factCheckMode ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                                <span>{t.factCheck}</span>
                            </button>
                        </div>
                        <button onClick={handleGenerate} disabled={isLoading || !task.trim()}
                            className="btn h-12 rounded-xl text-white text-base font-bold tracking-wide flex items-center justify-center gap-2.5 w-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 relative overflow-hidden group"
                            style={{
                                background: `linear-gradient(135deg, ${domainColor.text}, ${domainColor.text}dd)`,
                                boxShadow: `0 8px 20px -6px ${domainColor.text}66`
                            }}>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-md pointer-events-none" />
                            {isLoading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /><span>{progressPhases[progressStep]?.label || t.compiling}</span></>
                            ) : (
                                <><Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" /><span>{t.compile}</span></>
                            )}
                        </button>
                        {error && <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
                    </div>
                </div>
            </div>

            {/* ═══ LEFT COLUMN: Output Console ═══ */}
            <div className="card overflow-auto flex flex-col lg:order-1">
                <div className="card-header" dir={textDir}>
                    <div className="flex items-center justify-between" style={{ flexDirection: flexDir }}>
                        <div className="flex items-center gap-3" style={{ flexDirection: flexDir }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: domainColor.bg }}>
                                <DomainIcon className="w-5 h-5" style={{ color: domainColor.text }} />
                            </div>
                            <div style={{ textAlign: isArabic ? 'right' : 'left' }}>
                                <h3 className="font-bold text-text1">{t.masterPrompt}</h3>
                                <p className="text-xs text-zinc-500">{currentDomain.emoji} {currentDomain.label.replace(currentDomain.emoji, '').trim()}</p>
                            </div>
                        </div>
                        {generatedPrompt && (
                            <div className="flex gap-2">
                                <button onClick={handleCopy} className="btn btn-secondary text-xs px-3 py-1.5">
                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{copied ? t.copied : t.copy}</span>
                                </button>
                                <button onClick={handleRefine} disabled={isRefining}
                                    className="btn btn-secondary text-xs px-3 py-1.5"
                                    style={{ background: 'rgba(168,85,247,0.1)', borderColor: 'rgba(168,85,247,0.3)' }}>
                                    {isRefining ? <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" /> : <RefreshCw className="w-3.5 h-3.5 text-purple-400" />}
                                    <span className="text-purple-400">{t.refine}</span>
                                </button>
                                <button onClick={handleSimulate} disabled={isSimulating}
                                    className="btn btn-secondary text-xs px-3 py-1.5"
                                    style={{ background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.3)' }}>
                                    {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" /> : <Play className="w-3.5 h-3.5 text-blue-400" />}
                                    <span className="text-blue-400">{t.test}</span>
                                </button>
                                {/* Export */}
                                <button onClick={() => handleExport('md')} className="btn btn-secondary text-xs px-2 py-1.5" title="Export as .md">
                                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                                </button>
                            </div>
                        )}
                    </div>
                    {/* A/B + Diff toggles */}
                    {generatedPrompt && (
                        <div className="flex gap-2 px-4 -mt-2">
                            <button onClick={() => setAbMode(!abMode)}
                                className={`text-[10px] px-2 py-0.5 rounded border transition-all ${abMode ? 'bg-orange-500/15 border-orange-500/30 text-orange-400' : 'border-white/5 text-zinc-500 hover:border-white/15'}`}>
                                {isArabic ? 'مقارنة A/B' : 'A/B Test'}
                            </button>
                            {previousPrompt && (
                                <button onClick={() => setShowDiff(!showDiff)}
                                    className={`text-[10px] px-2 py-0.5 rounded border transition-all ${showDiff ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' : 'border-white/5 text-zinc-500 hover:border-white/15'}`}>
                                    <GitCompare className="w-3 h-3 inline mr-1" /> {isArabic ? 'الفرق' : 'Diff'}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="card-body flex-1 flex flex-col gap-4">
                    <div className="code-block flex-1">
                        <div className="code-block-header">
                            <span className="text-xs text-zinc-500 font-mono">
                                ARCHITECT v5.0 • {domain.toUpperCase()} • {resolvedStrategy.toUpperCase().replace(/_/g, '_')} • {/[\u0600-\u06FF]/.test(task) ? 'AR' : 'EN'}
                            </span>
                            {Object.keys(domainParams).length > 0 && (
                                <span className="text-xs" style={{ color: domainColor.text }}>
                                    {Object.entries(domainParams).filter(([_, v]) => v).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                                </span>
                            )}
                        </div>
                        <div className="code-block-content min-h-[280px] max-h-[500px] overflow-auto" dir="auto">
                            {/* Version Diff View */}
                            {showDiff && previousPrompt ? (
                                <div className="text-xs font-mono space-y-0">
                                    {computeDiff(previousPrompt, generatedPrompt).map((line, i) => (
                                        <div key={i} className={`px-2 py-0.5 ${line.type === 'added' ? 'bg-emerald-500/10 text-emerald-300 border-l-2 border-emerald-500' : line.type === 'removed' ? 'bg-red-500/10 text-red-300 border-l-2 border-red-500 line-through opacity-60' : 'text-zinc-400'}`}>
                                            <span className="text-zinc-600 mr-2">{line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}</span>
                                            {line.text}
                                        </div>
                                    ))}
                                </div>
                            ) : isLoading ? (
                                /* ── Progress Bar ── */
                                <div className="flex flex-col items-center justify-center h-full py-16 px-6 gap-6" dir={textDir}>
                                    <div className="relative w-20 h-20">
                                        <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
                                        <svg className="absolute inset-0 w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                            <circle cx="40" cy="40" r="36" fill="none" stroke={domainColor.text} strokeWidth="4" strokeLinecap="round"
                                                strokeDasharray={`${(progressPhases[progressStep]?.pct || 10) * 2.26} 226`}
                                                className="transition-all duration-1000 ease-out" style={{ filter: `drop-shadow(0 0 8px ${domainColor.text}66)` }} />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-lg font-bold" style={{ color: domainColor.text }}>{progressPhases[progressStep]?.pct || 10}%</span>
                                        </div>
                                    </div>
                                    <div className="text-center space-y-2 w-full max-w-xs">
                                        <p className="text-sm font-medium text-zinc-300">{progressPhases[progressStep]?.label}</p>
                                        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{
                                                width: `${progressPhases[progressStep]?.pct || 10}%`,
                                                background: `linear-gradient(90deg, ${domainColor.text}, ${domainColor.text}aa)`
                                            }} />
                                        </div>
                                        <div className="flex justify-between">
                                            {progressPhases.map((_, i) => (
                                                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= progressStep ? 'scale-100' : 'scale-75 opacity-30'}`}
                                                    style={{ backgroundColor: i <= progressStep ? domainColor.text : '#3f3f46' }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : generatedPrompt ? (
                                /* ── Rich Formatted Output ── */
                                <div className="space-y-1 px-1" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif" }}>
                                    {generatedPrompt.split('\n').map((line, i) => {
                                        // H1 headers
                                        if (/^#\s+/.test(line)) return (
                                            <h2 key={i} className="text-base font-bold mt-4 mb-1 pb-1 border-b border-white/5 flex items-center gap-2" style={{ color: domainColor.text }}>
                                                <span className="w-1 h-5 rounded-full" style={{ backgroundColor: domainColor.text }} />
                                                {line.replace(/^#+\s*/, '')}
                                            </h2>
                                        );
                                        // H2/H3 subheaders
                                        if (/^#{2,3}\s+/.test(line)) return (
                                            <h3 key={i} className="text-sm font-semibold mt-3 mb-0.5 text-purple-300">
                                                {line.replace(/^#+\s*/, '')}
                                            </h3>
                                        );
                                        // Numbered steps
                                        if (/^\d+\.\s/.test(line)) {
                                            const parts = line.match(/^(\d+\.)\s(.*)/);
                                            return (
                                                <div key={i} className="flex gap-2 py-0.5 text-[13px] leading-relaxed text-zinc-300">
                                                    <span className="font-bold shrink-0" style={{ color: domainColor.text }}>{parts?.[1]}</span>
                                                    <span dangerouslySetInnerHTML={{
                                                        __html: (parts?.[2] || line)
                                                            .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e2e8f0">$1</strong>')
                                                            .replace(/\{\{(.*?)\}\}/g, '<code style="background:rgba(251,191,36,0.15);color:#fbbf24;padding:1px 6px;border-radius:4px;font-size:12px">{{$1}}</code>')
                                                    }} />
                                                </div>
                                            );
                                        }
                                        // Bullet points
                                        if (/^[-•✓✅]\s/.test(line)) return (
                                            <div key={i} className="flex gap-2 py-0.5 text-[13px] leading-relaxed text-zinc-300 pl-1">
                                                <span className="shrink-0 mt-0.5" style={{ color: /^[✓✅]/.test(line) ? '#34d399' : '#67e8f9' }}>•</span>
                                                <span dangerouslySetInnerHTML={{
                                                    __html: line.replace(/^[-•✓✅]\s*/, '')
                                                        .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e2e8f0">$1</strong>')
                                                        .replace(/\{\{(.*?)\}\}/g, '<code style="background:rgba(251,191,36,0.15);color:#fbbf24;padding:1px 6px;border-radius:4px;font-size:12px">{{$1}}</code>')
                                                }} />
                                            </div>
                                        );
                                        // XML tags
                                        if (/^<\/?[A-Za-z]+>$/.test(line.trim())) return (
                                            <div key={i} className="text-xs font-mono text-red-400/70 py-0.5">{line}</div>
                                        );
                                        // Warning/negative lines
                                        if (/🚫|⛔|NEVER|DON'T|NOT|ZERO/.test(line)) return (
                                            <div key={i} className="text-[13px] text-red-400 py-0.5 font-medium">{line}</div>
                                        );
                                        // Empty lines
                                        if (!line.trim()) return <div key={i} className="h-2" />;
                                        // Default paragraph
                                        return (
                                            <p key={i} className="text-[13px] leading-relaxed text-zinc-300 py-0.5"
                                                dangerouslySetInnerHTML={{
                                                    __html: line
                                                        .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e2e8f0">$1</strong>')
                                                        .replace(/\{\{(.*?)\}\}/g, '<code style="background:rgba(251,191,36,0.15);color:#fbbf24;padding:1px 6px;border-radius:4px;font-size:12px">{{$1}}</code>')
                                                        .replace(/`([^`]+)`/g, '<code style="background:rgba(139,92,246,0.1);color:#a78bfa;padding:1px 5px;border-radius:3px;font-size:12px">$1</code>')
                                                }} />
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12" dir={textDir}>
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: domainColor.bg }}>
                                        <DomainIcon className="w-8 h-8" style={{ color: domainColor.text }} />
                                    </div>
                                    <p className="text-muted text-sm mb-1">{t.outputHere}</p>
                                    <p className="text-xs text-zinc-600">{t.dynamicContext}</p>
                                    <p className="text-[10px] text-zinc-700 mt-4">⌨️ Ctrl+Enter {isArabic ? 'لتوليد سريع' : 'to generate'}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* A/B Comparison */}
                    {abMode && abPromptB && (
                        <div className="code-block border-orange-500/20">
                            <div className="code-block-header" style={{ background: 'rgba(249,115,22,0.1)' }}>
                                <span className="text-xs text-orange-400 font-medium flex items-center gap-2">
                                    🅱️ {isArabic ? 'النسخة البديلة' : 'Variant B'} ({resolvedStrategy === 'chain_of_thought' ? 'Tree-of-Thought' : 'Chain-of-Thought'})
                                </span>
                                <button onClick={() => { setGeneratedPrompt(abPromptB); setAbPromptB(generatedPrompt); }} className="text-[10px] text-orange-400 hover:text-orange-300">
                                    {isArabic ? 'استبدال ↔' : 'Swap ↔'}
                                </button>
                            </div>
                            <div className="code-block-content max-h-[200px] overflow-auto">
                                {isLoadingB ? (
                                    <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-orange-400" /></div>
                                ) : (
                                    <pre className="whitespace-pre-wrap text-orange-200/80 text-sm">{abPromptB}</pre>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Simulation Output */}
                    {showSimulation && (
                        <div className="code-block border-border/30">
                            <div className="code-block-header" style={{ background: 'rgba(59,130,246,0.1)' }}>
                                <span className="text-xs text-blue-400 font-medium flex items-center gap-2">
                                    <Play className="w-3.5 h-3.5" /> {t.testOutput}
                                </span>
                            </div>
                            <div className="code-block-content max-h-[180px] overflow-auto">
                                {isSimulating ? (
                                    <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-400" /></div>
                                ) : (
                                    <pre className="whitespace-pre-wrap text-blue-200/80 text-sm">{simulatedOutput}</pre>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Prompt Linter */}
                    {generatedPrompt && (() => {
                        const warnings = [];
                        if (generatedPrompt.length < 200) warnings.push(isArabic ? 'البرومبت قصير جداً — أضف تفاصيل أكثر' : 'Prompt is very short — consider adding more detail');
                        if (generatedPrompt.length > 5000) warnings.push(isArabic ? 'البرومبت طويل جداً — قد يضيع الـ AI' : 'Prompt is very long — AI may lose focus');
                        if (!/role|persona|expert|you are|الدور|خبير|أنت|شخصية/i.test(generatedPrompt)) warnings.push(isArabic ? 'لا يوجد تعريف للدور' : 'No role/persona defined');
                        if (!/\n#|\n\*\*|\n##/.test(generatedPrompt)) warnings.push(isArabic ? 'لا يوجد تنظيم بالعناوين' : 'No section headers found');
                        if (warnings.length === 0) return null;
                        return (
                            <div className="p-2 rounded-lg border border-amber-500/15 bg-amber-500/5 space-y-1">
                                {warnings.map((w, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[10px] text-amber-400">
                                        <AlertTriangle className="w-3 h-3 shrink-0" /> {w}
                                    </div>
                                ))}
                            </div>
                        );
                    })()}

                    {/* Pro Tip */}
                    <div className="p-3 rounded-lg border border-amber-500/10 bg-amber-500/5" dir={textDir}>
                        <div className="flex items-start gap-3" style={{ flexDirection: flexDir }}>
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-100/60" style={{ textAlign: isArabic ? 'right' : 'left' }}>{t.proTip}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ TEMPLATE BROWSER MODAL ═══ */}
            {
                showTemplates && (
                    <>
                        <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm" onClick={() => setShowTemplates(false)}
                            style={{ animation: 'fadeIn 0.15s ease-out' }} />
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
                            <div className="pointer-events-auto w-[680px] max-w-[92vw] max-h-[80vh] rounded-2xl overflow-hidden flex flex-col"
                                style={{ animation: 'fadeIn 0.2s ease-out', background: 'rgba(15,15,25,0.97)', backdropFilter: 'blur(20px)', border: '1px solid rgba(168,85,247,0.2)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-purple-500/10" style={{ background: 'rgba(168,85,247,0.04)' }}>
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="w-5 h-5 text-purple-400" />
                                        <h3 className="font-bold text-text1">{t.browseTemplates}</h3>
                                        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">{domainTemplates.length}</span>
                                    </div>
                                    <button onClick={() => setShowTemplates(false)} className="p-1.5 rounded-lg hover:bg-white/5"><X className="w-4 h-4 text-zinc-400" /></button>
                                </div>
                                {/* Search */}
                                <div className="px-5 py-3 border-b border-white/5">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input type="text" value={templateSearch} onChange={(e) => setTemplateSearch(e.target.value)}
                                            placeholder="Search templates..." className="input-base input-sm w-full pl-10" />
                                    </div>
                                </div>
                                {/* Templates List */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {domainTemplates.map((tmpl) => (
                                        <div key={tmpl.id} className="p-4 rounded-xl border border-white/5 hover:border-purple-500/20 transition-all cursor-pointer group"
                                            style={{ background: 'rgba(255,255,255,0.02)' }} onClick={() => handleUseTemplate(tmpl)}>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-text1 group-hover:text-purple-400 transition-colors">
                                                        {tmpl.title?.[lang] || tmpl.title?.en}
                                                    </h4>
                                                    <p className="text-xs text-zinc-500 mt-1">{tmpl.description?.[lang] || tmpl.description?.en}</p>
                                                </div>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${tmpl.difficulty === 'advanced' ? 'bg-red-500/10 text-red-400' : tmpl.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                    {tmpl.difficulty}
                                                </span>
                                            </div>
                                            <div className="flex gap-1.5 mt-2">
                                                {tmpl.tags?.map(tag => (
                                                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-500">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {domainTemplates.length === 0 && (
                                        <div className="text-center py-8 text-zinc-500 text-sm">No templates found</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )
            }


        </div >
    );
};

export default PromptArchitect;
