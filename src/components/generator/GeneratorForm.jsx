import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import {
    Type, Users, Film, Clock, Palette, Sparkles, Loader2, UserCircle,
    Mic, Languages, Wand2, Volume2, Maximize, Hash, Zap, ShieldAlert,
    Lightbulb, RefreshCw, BookOpen, Target, Plus, X, Settings2
} from 'lucide-react';
import { generate_prompt, brainstorm_concept } from '../../api/promptApi';
import { Toggle, VisualSelector, FormField, TextInput, TextArea, Select } from './FormPrimitives';

const GeneratorForm = () => {
    const {
        generatorInputs, updateGeneratorInput, setGeneratedOutput,
        isGenerating, setIsGenerating, setGenerationProgress,
        t, isRTL, language, options: rawOptions, updateCharacter
    } = useAppContext();
    const toast = useToast();

    // Memoised: this object and its eight `|| []` fallbacks were rebuilt on
    // every render — including every keystroke in the idea field — handing all
    // eight Select components a brand-new array prop each time.
    const options = useMemo(() => ({
        videoStyles: rawOptions?.videoStyles || [], genres: rawOptions?.genres || [],
        aspectRatios: rawOptions?.aspectRatios || [], characterCounts: rawOptions?.characterCounts || [],
        durations: rawOptions?.durations || [], voiceTones: rawOptions?.voiceTones || [],
        videoLanguages: rawOptions?.videoLanguages || [], characterTypes: rawOptions?.characterTypes || [],
    }), [rawOptions]);

    const safeT = (key, fallback = '') => { const val = t?.(key); return (val && val !== key) ? val : fallback; };
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestedIdeas, setSuggestedIdeas] = useState([]);
    const [selectedIdeaIndex, setSelectedIdeaIndex] = useState(-1);
    const [error, setError] = useState(null);
    const conceptSectionRef = useRef(null);
    const pendingTimersRef = useRef([]);
    useEffect(() => () => pendingTimersRef.current.forEach(clearTimeout), []);
    // (Removed: a modalPosition state whose value was destructured away and never
    // read. Its effect called getBoundingClientRect on every suggestion, forcing a
    // synchronous layout and an extra render to position a modal that is
    // `position: fixed; inset: 0` and needs no measurement.)

    const handleSuggestIdea = async () => {
        setIsSuggesting(true); setSuggestedIdeas([]); setSelectedIdeaIndex(-1);
        try {
            const prevTitles = JSON.parse(localStorage.getItem('promptforge_prev_ideas') || '[]');
            const inputsWithHistory = { ...generatorInputs, _previousTitles: prevTitles.slice(-15) };
            const response = await brainstorm_concept(inputsWithHistory);
            if (response?.ideas && Array.isArray(response.ideas) && response.ideas.length > 0) {
                const normalizedIdeas = response.ideas.map((idea) => {
                    if (typeof idea === 'string') return { title: idea, viral_hook: '', lesson: '' };
                    return { title: idea.title || idea.concept || JSON.stringify(idea), viral_hook: idea.viral_hook || idea.hook || '', lesson: idea.lesson || idea.moral || '' };
                });
                setSuggestedIdeas(normalizedIdeas);
                const newTitles = normalizedIdeas.map(i => i.title).filter(Boolean);
                localStorage.setItem('promptforge_prev_ideas', JSON.stringify([...prevTitles, ...newTitles].slice(-25)));
            } else if (typeof response === 'string') {
                setSuggestedIdeas([{ title: response, viral_hook: '', lesson: '' }]);
            }
        } catch (err) {
            console.error('Suggest error:', err);
            const errorMsg = err.message || String(err);
            setError(errorMsg.includes('JSON') ? `AI Formatting Error: ${errorMsg}` : `Error: ${errorMsg}`);
        } finally { setIsSuggesting(false); }
    };

    const handlePickIdea = (idea, index) => {
        setSelectedIdeaIndex(index); updateGeneratorInput('coreIdea', idea.title);
        setTimeout(() => { setSuggestedIdeas([]); setSelectedIdeaIndex(-1); }, 200);
    };

    const handleGenerate = async () => {
        if (!generatorInputs?.coreIdea?.trim()) { toast.warning(safeT('enterCoreIdea', 'Please enter a video concept')); return; }
        if (!generatorInputs?.duration) { toast.warning(language === 'ar' ? 'الرجاء اختيار المدة أولاً' : 'Please select a duration first'); return; }
        setIsGenerating(true); setGenerationProgress(0); setError(null);
        const stages = [{ target: 15, delay: 800 }, { target: 35, delay: 3000 }, { target: 55, delay: 6000 }, { target: 75, delay: 12000 }, { target: 88, delay: 18000 }];
        const progressTimers = stages.map(stage => setTimeout(() => setGenerationProgress(prev => Math.max(prev, stage.target)), stage.delay));
        // Also tracked in a ref so unmount can clear them: the success and error
        // paths below both clear, but neither runs if the user leaves the tab
        // mid-generation, and the timers then setState on an unmounted tree.
        pendingTimersRef.current = progressTimers;
        try {
            const result = await generate_prompt(generatorInputs);
            progressTimers.forEach(clearTimeout); setGenerationProgress(100);
            await new Promise(r => setTimeout(r, 400));
            if (!result) throw new Error('Empty result from API');
            if (result.error) throw new Error(result.error);
            setGeneratedOutput(result);
        } catch (err) {
            progressTimers.forEach(clearTimeout); console.error('Generation error:', err);
            let errorMessage = 'Unknown error';
            if (typeof err === 'string') errorMessage = err;
            else if (err instanceof Error) errorMessage = err.message;
            else if (err?.error) errorMessage = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
            // The old 'API Key not configured' branch printed .env setup steps to
            // end users in production. It was a leftover from the removed
            // direct-to-OpenRouter mode; the key is server-side now and the
            // backend never emits that string.
            const isJSONError = errorMessage.includes('Failed to parse AI response');
            const errorMsg = isJSONError
                ? (language === 'ar' ? '❌ خطأ في تنسيق الاستجابة\n\nيرجى المحاولة مرة أخرى.' : '❌ AI Response Format Error\n\nPlease try again.')
                : (language === 'ar' ? `فشل إنشاء المخطط: ${errorMessage}` : `Failed to generate: ${errorMessage}`);
            setError(errorMsg); toast.error(errorMsg); setGeneratedOutput(null);
        } finally { setIsGenerating(false); setGenerationProgress(0); }
    };

    return (
        <div className="h-full flex flex-col">
            {error && (<div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-[var(--danger-fg)] text-xs flex items-center gap-2 backdrop-blur-sm"><ShieldAlert className="w-4 h-4 flex-shrink-0" />{error}</div>)}
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <div className="space-y-4 max-w-2xl mx-auto">
                    {/* ✦ Section 1: Creative Engine — Purple */}
                    <div className="relative group/section rounded-2xl overflow-hidden" style={{ background: 'rgba(139,92,246,0.03)', border: '1px solid rgba(139,92,246,0.12)' }}>
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-40 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative p-3.5 md:p-5">
                            <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)', boxShadow: '0 0 20px rgba(139,92,246,0.1)' }}><Sparkles className="w-4.5 h-4.5 text-[var(--brand-fg)]" /></div>
                                <div><h3 className="text-sm font-bold text-white">{safeT('ideaEngine', 'Creative Engine')}</h3><p className="text-[10px] text-muted">{language === 'ar' ? 'اختر النوع والأسلوب والشخصيات' : 'Genre, style & characters'}</p></div>
                            </div>
                            <div className="space-y-3.5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <FormField label={safeT('genre', 'Genre')} icon={Film} isRTL={isRTL}><Select value={generatorInputs?.genre || ''} onChange={(v) => updateGeneratorInput('genre', v)} options={options.genres} isRTL={isRTL} /></FormField>
                                    <FormField label={safeT('videoStyle', 'Visual Style')} icon={Palette} isRTL={isRTL}><Select value={generatorInputs?.videoStyle || ''} onChange={(v) => updateGeneratorInput('videoStyle', v)} options={options.videoStyles} isRTL={isRTL} /></FormField>
                                </div>
                                <div className="p-3 rounded-xl relative" style={{ background: 'var(--brand-tint)', border: '1px solid rgba(139,92,246,0.08)', zIndex: 20 }}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                        <FormField label={language === 'ar' ? '👤 الشخصية الرئيسية' : '👤 Primary Character'} icon={UserCircle} isRTL={isRTL}><Select value={generatorInputs?.characters?.primary || ''} onChange={(v) => updateCharacter('primary', 0, v)} options={options.characterTypes} isRTL={isRTL} /></FormField>
                                        <FormField label={safeT('videoLanguage', 'Dialogue Language')} icon={Languages} isRTL={isRTL}><Select value={generatorInputs?.videoLanguage || 'Egyptian Arabic (Masri)'} onChange={(v) => updateGeneratorInput('videoLanguage', v)} options={options.videoLanguages} isRTL={isRTL} /></FormField>
                                    </div>
                                    {(generatorInputs?.characters?.secondary || []).length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-violet-500/10">
                                            <div className={`text-[10px] font-semibold text-muted mb-2 flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}><Users className="w-3 h-3" />{language === 'ar' ? 'الشخصيات الثانوية' : 'Secondary Characters'}</div>
                                            <div className="space-y-2">
                                                {(generatorInputs.characters.secondary || []).map((sc, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 relative" style={{ animation: `slideUp 0.2s ease-out ${idx * 0.05}s both`, zIndex: 10 - idx }}>
                                                        <div className="flex-1"><Select value={sc || ''} onChange={(v) => updateCharacter('secondary', idx, v)} options={options.characterTypes} isRTL={isRTL} /></div>
                                                        <button onClick={() => updateCharacter('remove', idx)} className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/15 text-[var(--danger-fg)] hover:bg-red-500/20 hover:text-[var(--danger-fg)] transition-all flex items-center justify-center flex-shrink-0" title={language === 'ar' ? 'حذف' : 'Remove'}><X className="w-3.5 h-3.5" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {(generatorInputs?.characters?.secondary || []).length < 4 && (
                                        <button onClick={() => updateCharacter('add')} className="mt-3 w-full h-8 px-3 rounded-lg border border-dashed transition-all flex items-center justify-center gap-2 text-[11px] font-medium" style={{ borderColor: 'var(--brand-border)', color: 'var(--brand-fg)', background: 'var(--brand-tint)' }} onMouseEnter={(e) => { e.target.style.background = 'rgba(139,92,246,0.12)'; e.target.style.borderColor = 'rgba(139,92,246,0.4)'; }} onMouseLeave={(e) => { e.target.style.background = 'rgba(139,92,246,0.05)'; e.target.style.borderColor = 'rgba(139,92,246,0.25)'; }}>
                                            <Plus className="w-3 h-3" /><span>{language === 'ar' ? 'إضافة شخصية ثانوية' : 'Add Secondary'}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ✦ Section 2: Concept + Suggest — Amber */}
                    <div ref={conceptSectionRef} className="relative group/section rounded-2xl overflow-hidden" style={{ background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.12)' }}>
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-40 bg-amber-600/6 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative p-3.5 md:p-5">
                            <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)', boxShadow: '0 0 20px rgba(245,158,11,0.08)' }}><Type className="w-4.5 h-4.5 text-[var(--warn-fg)]" /></div>
                                    <div><h3 className="text-sm font-bold text-text1">{safeT('coreIdea', 'Video Concept')}</h3><p className="text-[10px] text-muted">{language === 'ar' ? 'اكتب فكرتك أو اترك الذكاء الاصطناعي يقترح' : 'Write your idea or let AI suggest'}</p></div>
                                </div>
                                <button onClick={handleSuggestIdea} disabled={isSuggesting} className="h-9 px-4 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 disabled:opacity-50" style={{ background: 'color-mix(in srgb, var(--warn-fg) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--warn-fg) 28%, transparent)', color: 'var(--warn-fg)', boxShadow: '0 0 15px rgba(245,158,11,0.08)' }}>
                                    {isSuggesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}<span>{safeT('suggestIdea', 'اقترح فكرة 💡')}</span>
                                </button>
                            </div>
                            <TextArea value={generatorInputs?.coreIdea || ''} onChange={(v) => updateGeneratorInput('coreIdea', v)} placeholder={safeT('coreIdeaPlaceholder', 'Idea will appear here...')} rows={2} isRTL={isRTL} />
                            {/* Idea Picker Modal */}
                            {(isSuggesting || suggestedIdeas.length > 0) && (<>
                                <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" onClick={() => { if (!isSuggesting) setSuggestedIdeas([]); }} style={{ animation: 'fadeIn 0.15s ease-out' }} />
                                <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
                                    <div className="overflow-hidden rounded-2xl pointer-events-auto" style={{ animation: 'fadeIn 0.2s ease-out', width: 'min(90vw, 520px)', background: 'var(--modal-bg)', backdropFilter: 'blur(20px)', border: '1px solid color-mix(in srgb, var(--warn-fg) 22%, transparent)', boxShadow: 'var(--dropdown-shadow)' }}>
                                        <div className={`flex items-center justify-between px-5 py-3.5 border-b border-amber-500/10 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ background: 'rgba(245,158,11,0.04)' }}>
                                            <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}><div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}><Lightbulb className="w-3.5 h-3.5 text-[var(--warn-fg)]" /></div><span className="text-sm font-semibold text-text1">{language === 'ar' ? 'اختر فكرة للفيديو' : 'Pick a video idea'}</span></div>
                                            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                {!isSuggesting && (<button onClick={handleSuggestIdea} className="h-7 px-2.5 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5" style={{ background: 'color-mix(in srgb, var(--warn-fg) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--warn-fg) 22%, transparent)', color: 'var(--warn-fg)' }}><RefreshCw className="w-3 h-3" /><span>{language === 'ar' ? 'توليد جديد' : 'Regenerate'}</span></button>)}
                                                <button onClick={() => { if (!isSuggesting) setSuggestedIdeas([]); }} disabled={isSuggesting} className="w-7 h-7 rounded-lg bg-bg2 border border-border text-text2 hover:bg-bg2 hover:text-text1 transition flex items-center justify-center text-sm disabled:opacity-30">✕</button>
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 max-h-[50vh] overflow-y-auto custom-scrollbar">
                                            {isSuggesting && (<div className="flex flex-col items-center justify-center gap-3 py-10"><Loader2 className="w-7 h-7 animate-spin text-[var(--warn-fg)]" /><span className="text-sm text-text2">{language === 'ar' ? 'جاري توليد أفكار ذكية...' : 'Generating smart ideas...'}</span></div>)}
                                            {!isSuggesting && suggestedIdeas.length > 0 && (<div className="flex flex-col gap-2">
                                                {suggestedIdeas.map((idea, idx) => (
                                                    <button key={idx} onClick={() => handlePickIdea(idea, idx)} className="w-full text-start p-3.5 rounded-xl border transition-all duration-200 group cursor-pointer" dir="auto" style={{ animation: `slideUp 0.3s ease-out ${idx * 0.08}s both`, background: selectedIdeaIndex === idx ? 'rgba(245,158,11,0.1)' : 'var(--overlay-3)', borderColor: selectedIdeaIndex === idx ? 'rgba(245,158,11,0.3)' : 'var(--border-color)' }}>
                                                        <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: selectedIdeaIndex === idx ? 'color-mix(in srgb, var(--warn-fg) 26%, transparent)' : 'color-mix(in srgb, var(--warn-fg) 14%, transparent)', color: 'var(--warn-fg)' }}>{idx + 1}</span>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[13px] font-medium leading-relaxed text-text1">{idea.title}</p>
                                                                {(!generatorInputs?.characters?.primary || generatorInputs.characters.primary.toLowerCase() === 'auto') && (
                                                                    <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${idx === 0 ? 'bg-blue-500/15 text-[var(--chart-5)] border-blue-500/25' : idx === 1 ? 'bg-emerald-500/15 text-[var(--success-fg)] border-emerald-500/25' : 'bg-purple-500/15 text-[var(--brand-fg)] border-purple-500/25'}`}>{idx === 0 ? (language === 'ar' ? '👤 إنسان' : '👤 Human') : idx === 1 ? (language === 'ar' ? '🐱 حيوان' : '🐱 Animal') : (language === 'ar' ? '🎲 عشوائي' : '🎲 Random')}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {(idea.viral_hook || idea.lesson) && (<div className={`mt-2 pt-2 border-t border-border flex flex-col gap-1 ${isRTL ? 'items-end pr-9' : 'items-start pl-9'}`}>
                                                            {idea.viral_hook && <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}><Target className="w-3 h-3 text-[var(--warn-fg)] flex-shrink-0" /><span className="text-[11px] text-[var(--warn-fg)] leading-snug">{idea.viral_hook}</span></div>}
                                                            {idea.lesson && <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}><BookOpen className="w-3 h-3 text-[var(--success-fg)] flex-shrink-0" /><span className="text-[11px] text-[var(--success-fg)] leading-snug">{idea.lesson}</span></div>}
                                                        </div>)}
                                                    </button>
                                                ))}
                                            </div>)}
                                        </div>
                                    </div>
                                </div>
                            </>)}
                        </div>
                    </div>

                    {/* ✦ Section 3: Production Settings — Cyan */}
                    <div className="relative group/section rounded-2xl overflow-hidden" style={{ background: 'rgba(6,182,212,0.03)', border: '1px solid rgba(6,182,212,0.12)' }}>
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-40 bg-cyan-600/6 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative p-3.5 md:p-5">
                            <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)', boxShadow: '0 0 20px rgba(6,182,212,0.08)' }}><Settings2 className="w-4.5 h-4.5 text-[var(--chart-3)]" /></div>
                                <div><h3 className="text-sm font-bold text-text1">{safeT('productionSettings', 'Production Settings')}</h3><p className="text-[10px] text-muted">{language === 'ar' ? 'نسبة العرض والمدة والمشاهد' : 'Aspect ratio, duration & scenes'}</p></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 mb-4 items-end">
                                <FormField label={safeT('aspectRatio', 'Aspect Ratio')} icon={Maximize} isRTL={isRTL}><VisualSelector options={options.aspectRatios} value={generatorInputs?.aspectRatio || '16:9'} onChange={(v) => updateGeneratorInput('aspectRatio', v)} isRTL={isRTL} /></FormField>
                                <FormField label={safeT('duration', 'Duration')} icon={Clock} isRTL={isRTL}><Select value={generatorInputs?.duration || ''} onChange={(v) => updateGeneratorInput('duration', v)} options={options.durations} placeholder={language === 'ar' ? '-- اختر --' : '-- Select --'} isRTL={isRTL} /></FormField>
                                <FormField label={safeT('scenes', 'Scenes')} icon={Hash} isRTL={isRTL} helpText={language === 'ar' ? 'عدد المشاهد المطلوبة في الفيديو' : 'Number of scenes for the video'}><TextInput type="number" min={4} max={20} value={generatorInputs?.numScenes || '5'} onChange={(v) => updateGeneratorInput('numScenes', v)} placeholder="5" /></FormField>
                            </div>
                            <div className="pt-3.5 mt-1 rounded-xl p-3" style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.08)' }}>
                                <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Volume2 className="w-3.5 h-3.5 text-cyan-500/60" /><span className="text-xs font-semibold text-text2">{safeT('audioSettings', 'Audio')}</span></div>
                                    <Toggle active={audioEnabled} onChange={setAudioEnabled} purple />
                                </div>
                                {audioEnabled && (<div style={{ animation: 'slideUp 0.15s ease-out' }}>
                                    <FormField label={safeT('voiceTone', 'Voice Tone')} icon={Mic} isRTL={isRTL}><Select value={generatorInputs?.voiceTone || 'Professional'} onChange={(v) => updateGeneratorInput('voiceTone', v)} options={options.voiceTones} isRTL={isRTL} /></FormField>
                                </div>)}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                <FormField label={safeT('customInstructions', 'Custom Notes')} isRTL={isRTL} helpText={language === 'ar' ? 'ملاحظات إضافية مثل: إضاءة خافتة، كاميرا يدوية...' : 'Extra notes like: moody lighting, handheld camera...'}><TextArea value={generatorInputs?.modifiers || ''} onChange={(v) => updateGeneratorInput('modifiers', v)} placeholder={safeT('customInstructionsPlaceholder', 'Moody lighting, handheld camera...')} rows={2} /></FormField>
                                <FormField label={safeT('prohibitions', 'Prohibitions')} icon={ShieldAlert} isRTL={isRTL} helpText={language === 'ar' ? 'أشياء يجب تجنبها: عنف، دم، محتوى غير لائق...' : 'Things to avoid: violence, blood, inappropriate content...'}><TextArea value={generatorInputs?.prohibitions || ''} onChange={(v) => updateGeneratorInput('prohibitions', v)} placeholder={safeT('prohibitionsPlaceholder', 'No violence, no blood...')} rows={2} /></FormField>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Sticky Generate Button */}
            <div className="sticky bottom-0 pt-3 pb-2.5 mt-3 z-20" style={{ backdropFilter: 'blur(12px)', background: `linear-gradient(to top, var(--bg-surface), color-mix(in srgb, var(--bg-surface) 70%, transparent) 60%, transparent)`, borderTop: '1px solid var(--border-color)' }}>
                <button onClick={handleGenerate} disabled={isGenerating || !generatorInputs?.coreIdea?.trim() || !generatorInputs?.duration} className="w-full h-12 md:h-12 px-5 rounded-2xl text-sm on-brand text-white font-bold transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:hover:scale-100 hover:scale-[1.01] active:scale-[0.99]" style={{ maxWidth: 640, margin: '0 auto', background: isGenerating ? 'linear-gradient(135deg, #4338CA, #6D28D9)' : 'linear-gradient(135deg, var(--cta-1), var(--cta-2))', boxShadow: isGenerating ? '0 4px 20px rgba(99,102,241,0.2)' : '0 6px 25px rgba(139,92,246,0.3), 0 0 40px rgba(139,92,246,0.08)' }}>
                    {isGenerating ? (<><Loader2 className="w-4.5 h-4.5 animate-spin" /><span>{language === 'ar' ? 'جاري الابتكار...' : 'Crafting Blueprint...'}</span></>) : (<><Wand2 className="w-4.5 h-4.5" /><span>{language === 'ar' ? 'توليد السيناريو' : 'Generate Blueprint'}</span></>)}
                </button>
            </div>
        </div>
    );
};

export default GeneratorForm;
