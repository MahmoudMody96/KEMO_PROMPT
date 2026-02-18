import React, { useState, useRef, useEffect } from 'react';
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
        isGenerating, setIsGenerating, generationProgress, setGenerationProgress,
        t, isRTL, language, options: rawOptions, updateCharacter
    } = useAppContext();
    const toast = useToast();

    const options = {
        videoStyles: rawOptions?.videoStyles || [], genres: rawOptions?.genres || [],
        aspectRatios: rawOptions?.aspectRatios || [], characterCounts: rawOptions?.characterCounts || [],
        durations: rawOptions?.durations || [], voiceTones: rawOptions?.voiceTones || [],
        videoLanguages: rawOptions?.videoLanguages || [], characterTypes: rawOptions?.characterTypes || [],
    };

    const safeT = (key, fallback = '') => { const val = t?.(key); return (val && val !== key) ? val : fallback; };
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestedIdeas, setSuggestedIdeas] = useState([]);
    const [selectedIdeaIndex, setSelectedIdeaIndex] = useState(-1);
    const [error, setError] = useState(null);
    const conceptSectionRef = useRef(null);
    const [modalPosition, setModalPosition] = useState({ bottom: 0, left: 0, width: 0 });

    useEffect(() => {
        if ((isSuggesting || suggestedIdeas.length > 0) && conceptSectionRef.current) {
            const rect = conceptSectionRef.current.getBoundingClientRect();
            setModalPosition({ bottom: `${window.innerHeight - rect.top - 30}px`, left: `${rect.left}px`, width: `${rect.width}px` });
        }
    }, [isSuggesting, suggestedIdeas]);

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
            const isAPIKeyError = errorMessage.includes('API Key not configured');
            const isJSONError = errorMessage.includes('Failed to parse AI response');
            let errorMsg;
            if (isAPIKeyError) errorMsg = language === 'ar' ? '❌ مفتاح API غير مُعَد!\n\n📝 الخطوات:\n1. انسخ .env.example إلى .env\n2. احصل على مفتاح API\n3. أضفه إلى ملف .env\n4. أعد تشغيل الخادم' : '❌ API Key not configured!\n\nSteps:\n1. Copy .env.example to .env\n2. Get API key from openrouter.ai/keys\n3. Add to .env\n4. Restart dev server';
            else if (isJSONError) errorMsg = language === 'ar' ? '❌ خطأ في تنسيق الاستجابة\n\nيرجى المحاولة مرة أخرى.' : '❌ AI Response Format Error\n\nPlease try again.';
            else errorMsg = language === 'ar' ? `فشل إنشاء المخطط: ${errorMessage}` : `Failed to generate: ${errorMessage}`;
            setError(errorMsg); toast.error(errorMsg); setGeneratedOutput(null);
        } finally { setIsGenerating(false); setGenerationProgress(0); }
    };

    return (
        <div className="h-full flex flex-col">
            {error && (<div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2 backdrop-blur-sm"><ShieldAlert className="w-4 h-4 flex-shrink-0" />{error}</div>)}
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <div className="space-y-4 max-w-2xl mx-auto">
                    {/* ✦ Section 1: Creative Engine — Purple */}
                    <div className="relative group/section rounded-2xl overflow-hidden" style={{ background: 'rgba(139,92,246,0.03)', border: '1px solid rgba(139,92,246,0.12)' }}>
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-40 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative p-3.5 md:p-5">
                            <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)', boxShadow: '0 0 20px rgba(139,92,246,0.1)' }}><Sparkles className="w-4.5 h-4.5 text-violet-400" /></div>
                                <div><h3 className="text-sm font-bold text-white">{safeT('ideaEngine', 'Creative Engine')}</h3><p className="text-[10px] text-zinc-500">{language === 'ar' ? 'اختر النوع والأسلوب والشخصيات' : 'Genre, style & characters'}</p></div>
                            </div>
                            <div className="space-y-3.5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <FormField label={safeT('genre', 'Genre')} icon={Film} isRTL={isRTL}><Select value={generatorInputs?.genre || ''} onChange={(v) => updateGeneratorInput('genre', v)} options={options.genres} isRTL={isRTL} /></FormField>
                                    <FormField label={safeT('videoStyle', 'Visual Style')} icon={Palette} isRTL={isRTL}><Select value={generatorInputs?.videoStyle || ''} onChange={(v) => updateGeneratorInput('videoStyle', v)} options={options.videoStyles} isRTL={isRTL} /></FormField>
                                </div>
                                <div className="p-3 rounded-xl relative" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.08)', zIndex: 20 }}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                        <FormField label={language === 'ar' ? '👤 الشخصية الرئيسية' : '👤 Primary Character'} icon={UserCircle} isRTL={isRTL}><Select value={generatorInputs?.characters?.primary || ''} onChange={(v) => updateCharacter('primary', 0, v)} options={options.characterTypes} isRTL={isRTL} /></FormField>
                                        <FormField label={safeT('videoLanguage', 'Dialogue Language')} icon={Languages} isRTL={isRTL}><Select value={generatorInputs?.videoLanguage || 'Egyptian Arabic (Masri)'} onChange={(v) => updateGeneratorInput('videoLanguage', v)} options={options.videoLanguages} isRTL={isRTL} /></FormField>
                                    </div>
                                    {(generatorInputs?.characters?.secondary || []).length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-violet-500/10">
                                            <div className={`text-[10px] font-semibold text-zinc-500 mb-2 flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}><Users className="w-3 h-3" />{language === 'ar' ? 'الشخصيات الثانوية' : 'Secondary Characters'}</div>
                                            <div className="space-y-2">
                                                {(generatorInputs.characters.secondary || []).map((sc, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 relative" style={{ animation: `slideUp 0.2s ease-out ${idx * 0.05}s both`, zIndex: 10 - idx }}>
                                                        <div className="flex-1"><Select value={sc || ''} onChange={(v) => updateCharacter('secondary', idx, v)} options={options.characterTypes} isRTL={isRTL} /></div>
                                                        <button onClick={() => updateCharacter('remove', idx)} className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/15 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all flex items-center justify-center flex-shrink-0" title={language === 'ar' ? 'حذف' : 'Remove'}><X className="w-3.5 h-3.5" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {(generatorInputs?.characters?.secondary || []).length < 4 && (
                                        <button onClick={() => updateCharacter('add')} className="mt-3 w-full h-8 px-3 rounded-lg border border-dashed transition-all flex items-center justify-center gap-2 text-[11px] font-medium" style={{ borderColor: 'rgba(139,92,246,0.25)', color: 'rgba(139,92,246,0.8)', background: 'rgba(139,92,246,0.05)' }} onMouseEnter={(e) => { e.target.style.background = 'rgba(139,92,246,0.12)'; e.target.style.borderColor = 'rgba(139,92,246,0.4)'; }} onMouseLeave={(e) => { e.target.style.background = 'rgba(139,92,246,0.05)'; e.target.style.borderColor = 'rgba(139,92,246,0.25)'; }}>
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
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)', boxShadow: '0 0 20px rgba(245,158,11,0.08)' }}><Type className="w-4.5 h-4.5 text-amber-400" /></div>
                                    <div><h3 className="text-sm font-bold text-white">{safeT('coreIdea', 'Video Concept')}</h3><p className="text-[10px] text-zinc-500">{language === 'ar' ? 'اكتب فكرتك أو اترك الذكاء الاصطناعي يقترح' : 'Write your idea or let AI suggest'}</p></div>
                                </div>
                                <button onClick={handleSuggestIdea} disabled={isSuggesting} className="h-9 px-4 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(234,88,12,0.15))', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24', boxShadow: '0 0 15px rgba(245,158,11,0.08)' }}>
                                    {isSuggesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}<span>{safeT('suggestIdea', 'اقترح فكرة 💡')}</span>
                                </button>
                            </div>
                            <TextArea value={generatorInputs?.coreIdea || ''} onChange={(v) => updateGeneratorInput('coreIdea', v)} placeholder={safeT('coreIdeaPlaceholder', 'Idea will appear here...')} rows={2} isRTL={isRTL} />
                            {/* Idea Picker Modal */}
                            {(isSuggesting || suggestedIdeas.length > 0) && (<>
                                <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" onClick={() => { if (!isSuggesting) setSuggestedIdeas([]); }} style={{ animation: 'fadeIn 0.15s ease-out' }} />
                                <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
                                    <div className="overflow-hidden rounded-2xl pointer-events-auto" style={{ animation: 'fadeIn 0.2s ease-out', width: 'min(90vw, 520px)', background: 'rgba(20,20,30,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(245,158,11,0.2)', boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(245,158,11,0.05)' }}>
                                        <div className={`flex items-center justify-between px-5 py-3.5 border-b border-amber-500/10 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ background: 'rgba(245,158,11,0.04)' }}>
                                            <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}><div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}><Lightbulb className="w-3.5 h-3.5 text-amber-400" /></div><span className="text-sm font-semibold text-white">{language === 'ar' ? 'اختر فكرة للفيديو' : 'Pick a video idea'}</span></div>
                                            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                {!isSuggesting && (<button onClick={handleSuggestIdea} className="h-7 px-2.5 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}><RefreshCw className="w-3 h-3" /><span>{language === 'ar' ? 'توليد جديد' : 'Regenerate'}</span></button>)}
                                                <button onClick={() => { if (!isSuggesting) setSuggestedIdeas([]); }} disabled={isSuggesting} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition flex items-center justify-center text-sm disabled:opacity-30">✕</button>
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 max-h-[50vh] overflow-y-auto custom-scrollbar">
                                            {isSuggesting && (<div className="flex flex-col items-center justify-center gap-3 py-10"><Loader2 className="w-7 h-7 animate-spin text-amber-400" /><span className="text-sm text-white/60">{language === 'ar' ? 'جاري توليد أفكار ذكية...' : 'Generating smart ideas...'}</span></div>)}
                                            {!isSuggesting && suggestedIdeas.length > 0 && (<div className="flex flex-col gap-2">
                                                {suggestedIdeas.map((idea, idx) => (
                                                    <button key={idx} onClick={() => handlePickIdea(idea, idx)} className="w-full text-start p-3.5 rounded-xl border transition-all duration-200 group cursor-pointer" dir="auto" style={{ animation: `slideUp 0.3s ease-out ${idx * 0.08}s both`, background: selectedIdeaIndex === idx ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.03)', borderColor: selectedIdeaIndex === idx ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)' }}>
                                                        <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: selectedIdeaIndex === idx ? 'rgba(245,158,11,0.3)' : 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>{idx + 1}</span>
                                                            <p className="text-[13px] font-medium leading-relaxed flex-1 text-white/90 group-hover:text-white">{idea.title}</p>
                                                        </div>
                                                        {(idea.viral_hook || idea.lesson) && (<div className={`mt-2 pt-2 border-t border-white/5 flex flex-col gap-1 ${isRTL ? 'items-end pr-9' : 'items-start pl-9'}`}>
                                                            {idea.viral_hook && <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}><Target className="w-3 h-3 text-orange-400 flex-shrink-0" /><span className="text-[11px] text-orange-300/70 leading-snug">{idea.viral_hook}</span></div>}
                                                            {idea.lesson && <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}><BookOpen className="w-3 h-3 text-emerald-400 flex-shrink-0" /><span className="text-[11px] text-emerald-300/70 leading-snug">{idea.lesson}</span></div>}
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
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)', boxShadow: '0 0 20px rgba(6,182,212,0.08)' }}><Settings2 className="w-4.5 h-4.5 text-cyan-400" /></div>
                                <div><h3 className="text-sm font-bold text-white">{safeT('productionSettings', 'Production Settings')}</h3><p className="text-[10px] text-zinc-500">{language === 'ar' ? 'نسبة العرض والمدة والمشاهد' : 'Aspect ratio, duration & scenes'}</p></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 mb-4 items-end">
                                <FormField label={safeT('aspectRatio', 'Aspect Ratio')} icon={Maximize} isRTL={isRTL}><VisualSelector options={options.aspectRatios} value={generatorInputs?.aspectRatio || '16:9'} onChange={(v) => updateGeneratorInput('aspectRatio', v)} isRTL={isRTL} /></FormField>
                                <FormField label={safeT('duration', 'Duration')} icon={Clock} isRTL={isRTL}><Select value={generatorInputs?.duration || ''} onChange={(v) => updateGeneratorInput('duration', v)} options={options.durations} placeholder={language === 'ar' ? '-- اختر --' : '-- Select --'} isRTL={isRTL} /></FormField>
                                <FormField label={safeT('scenes', 'Scenes')} icon={Hash} isRTL={isRTL} helpText={language === 'ar' ? 'عدد المشاهد المطلوبة في الفيديو' : 'Number of scenes for the video'}><TextInput type="number" value={generatorInputs?.numScenes || '5'} onChange={(v) => updateGeneratorInput('numScenes', v)} placeholder="5" /></FormField>
                            </div>
                            <div className="pt-3.5 mt-1 rounded-xl p-3" style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.08)' }}>
                                <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Volume2 className="w-3.5 h-3.5 text-cyan-500/60" /><span className="text-xs font-semibold text-zinc-400">{safeT('audioSettings', 'Audio')}</span></div>
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
            <div className="sticky bottom-0 pt-3 pb-2.5 mt-3 z-20" style={{ backdropFilter: 'blur(12px)', background: 'linear-gradient(to top, rgba(11,15,25,0.95), rgba(11,15,25,0.7) 60%, transparent)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <button onClick={handleGenerate} disabled={isGenerating || !generatorInputs?.coreIdea?.trim() || !generatorInputs?.duration} className="w-full h-12 md:h-12 px-5 rounded-2xl text-sm text-white font-bold transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:hover:scale-100 hover:scale-[1.01] active:scale-[0.99]" style={{ maxWidth: 640, margin: '0 auto', background: isGenerating ? 'linear-gradient(135deg, #4338ca, #6d28d9)' : 'linear-gradient(135deg, #3b82f6, #8b5cf6, #a855f7)', boxShadow: isGenerating ? '0 4px 20px rgba(99,102,241,0.2)' : '0 6px 25px rgba(139,92,246,0.3), 0 0 40px rgba(139,92,246,0.08)' }}>
                    {isGenerating ? (<><Loader2 className="w-4.5 h-4.5 animate-spin" /><span>{language === 'ar' ? 'جاري الابتكار...' : 'Crafting Blueprint...'}</span></>) : (<><Wand2 className="w-4.5 h-4.5" /><span>{language === 'ar' ? 'توليد السيناريو' : 'Generate Blueprint'}</span></>)}
                </button>
            </div>
        </div>
    );
};

export default GeneratorForm;
