import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import {
    UserCircle, Film, Sparkles, ChevronDown, Download, Trash2, Zap, FileJson, History, RefreshCw
} from 'lucide-react';
import { CharacterCard, SceneCard, CopyBtn } from './OutputCards';
import GeneratingState from './GeneratingState';
import { regenerate_scene } from '../../api/promptApi';
import { useToast } from '../ui/Toast';
import { validateConsistency } from './QualityValidation';

const ResultsPanel = () => {

    const [activeTab, setActiveTab] = useState('characters');
    const [visionCollapsed, setVisionCollapsed] = useState(true);
    const [expandedScene, setExpandedScene] = useState(0);
    const [regeneratingScene, setRegeneratingScene] = useState(-1);
    const { generatedOutput, setGeneratedOutput, isGenerating, generationProgress, t, isRTL, language, generatorInputs } = useAppContext();
    const toast = useToast();
    const safeT = (key, fallback = '') => { const val = t?.(key); return (val && val !== key) ? val : fallback; };

    // Save to history.
    //
    // The `kemo-last-scenario` write that used to be here was a duplicate:
    // AppContext already persists that key on every change. Two effects writing
    // the same key on the same state change is a race with no upside — this one
    // now only owns the history list.
    useEffect(() => {
        if (generatedOutput && !isGenerating) {
            try {
                const historyRaw = localStorage.getItem('kemo-scenario-history');
                const history = historyRaw ? JSON.parse(historyRaw) : [];
                const title = generatedOutput.meta_data?.title || generatedOutput.metadata?.title || new Date().toLocaleTimeString();
                const entry = { title, date: new Date().toISOString(), data: generatedOutput };
                const newHistory = [entry, ...history.filter(h => h.title !== title)].slice(0, 10);
                localStorage.setItem('kemo-scenario-history', JSON.stringify(newHistory));
            } catch (e) { /* quota exceeded — ignore */ }
        }
    }, [generatedOutput, isGenerating]);

    const tabs = [
        { id: 'characters', labelKey: 'charactersTab', fallback: 'Characters', icon: UserCircle },
        { id: 'screenplay', labelKey: 'screenplayTab', fallback: 'Screenplay', icon: Film }
    ];

    const getCharacters = (data) => {
        if (!data) return [];
        const chars = data.characters || data.characterBlueprints;
        if (Array.isArray(chars)) return chars.filter(Boolean);
        if (chars?.main) return [...(chars.main || []), ...(chars.supporting || [])].filter(Boolean);
        return [];
    };

    const getScenes = (data) => {
        if (!data) return [];
        const scenes = data.scenes || data.sceneDirectives;
        if (Array.isArray(scenes)) return scenes.filter(Boolean);
        return [];
    };

    /**
     * Replace one scene immutably.
     *
     * The previous version spread the top level only — `{ ...generatedOutput }`
     * leaves `scenes` pointing at the SAME array — then assigned into it. That
     * wrote straight into the array held in state: the array identity never
     * changed, so any memoised consumer would keep the stale value, and the
     * pre-edit scene was destroyed with no way back.
     *
     * The functional updater also matters here: both callers are async, so
     * closing over `generatedOutput` could clobber a concurrent edit.
     */
    const patchScene = React.useCallback((sceneIndex, patch) => {
        setGeneratedOutput((prev) => {
            if (!prev) return prev;
            const key = Array.isArray(prev.scenes) ? 'scenes'
                : Array.isArray(prev.sceneDirectives) ? 'sceneDirectives'
                    : null;
            if (!key || !prev[key][sceneIndex]) return prev;
            return {
                ...prev,
                [key]: prev[key].map((s, i) => (i === sceneIndex ? { ...s, ...patch } : s)),
            };
        });
    }, [setGeneratedOutput]);

    // Derived data and its audit are computed BEFORE the early returns below.
    // Hooks must run in the same order on every render, so anything memoised
    // cannot sit after a conditional return. Both getters handle a null
    // generatedOutput by returning [], so this is safe while still loading.
    const characters = React.useMemo(() => getCharacters(generatedOutput), [generatedOutput]);
    const scenes = React.useMemo(() => getScenes(generatedOutput), [generatedOutput]);

    // validateConsistency already existed but was never imported anywhere — the
    // check was written and then never run, so drift between scenes reached the
    // user unflagged. Memoised because it walks every scene prompt and this
    // component re-renders on each accordion toggle and inline edit.
    // Stable handlers. Each takes the scene index as an argument instead of
    // closing over it, so the identity never changes and React.memo on
    // SceneCard actually prevents the other cards from re-rendering.
    const handleToggleScene = React.useCallback((i) => {
        setExpandedScene((prev) => (prev === i ? -1 : i));
    }, []);

    const handleUpdateScene = React.useCallback((sceneIndex, field, value) => {
        patchScene(sceneIndex, { [field]: value });
    }, [patchScene]);

    const handleRegenerateScene = React.useCallback(async (sceneIndex) => {
        setRegeneratingScene(sceneIndex);
        try {
            const result = await regenerate_scene({
                sceneIndex,
                existingScenes: scenes,
                existingCharacters: characters,
                originalInputs: generatorInputs || {},
            });
            if (!result || result.error) {
                throw new Error(result?.error || safeT('regenFailed', 'The scene could not be regenerated'));
            }
            patchScene(sceneIndex, result);
        } catch (e) {
            // Was console-only: the spinner stopped and the scene silently
            // stayed as it was, which is indistinguishable from a regeneration
            // that produced identical text.
            console.error('Regenerate scene failed:', e);
            toast.error(e?.message || safeT('regenFailed', 'The scene could not be regenerated'));
        } finally {
            setRegeneratingScene(-1);
        }
        // Depends on the data it sends, so its identity changes only when that
        // data changes — not on an accordion toggle, which is the case memo is
        // protecting. safeT and toast are stable for the component's lifetime.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patchScene, scenes, characters, generatorInputs]);

    const audit = React.useMemo(
        () => validateConsistency(scenes, characters),
        [scenes, characters]
    );

    if (isGenerating) return <GeneratingState language={language} progress={generationProgress} />;

    if (!generatedOutput) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 md:px-8 relative overflow-hidden">
                {/* Document canvas pseudo-elements */}
                <div className="absolute pointer-events-none" style={{
                    width: 420, maxWidth: '70%', height: '70%',
                    borderRadius: 14,
                    background: 'linear-gradient(to bottom, var(--overlay-4), var(--overlay-2))',
                    filter: 'blur(0.2px)',
                }} />
                <div className="absolute pointer-events-none" style={{
                    top: '22%', width: 280, height: 6, borderRadius: 4,
                    background: 'var(--overlay-5)',
                }} />
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(108,92,255,0.06),transparent_70%)] pointer-events-none" />
                <div className="relative mb-5 p-5 rounded-full bg-surface border border-primary/10 shadow-card" style={{ opacity: 0.7, transform: 'scale(0.9)' }}>
                    <Sparkles className="w-7 h-7 text-primary animate-pulse" />
                </div>
                <h3 className="text-base font-semibold mb-1.5 text-text1" style={{ opacity: 0.9 }}>{safeT('readyToCreate', 'Ready to Create')}</h3>
                <p className="text-xs text-text2 max-w-[240px] leading-snug mb-5" style={{ opacity: 0.7 }}>{safeT('fillParams', 'Fill in the parameters and click Generate.')}</p>

                <div className="flex items-center gap-3 text-[10px] text-muted opacity-40">
                    <div className="w-6 h-px bg-border" />
                    <span>Kemo Prompt v9.0</span>
                    <div className="w-6 h-px bg-border" />
                </div>
            </div>
        );
    }

    const meta = generatedOutput.meta_data || generatedOutput.metadata || {};
    const blueprint = generatedOutput.creative_blueprint || null;

    return (
        <div className="h-full flex flex-col">
            {/* Action Bar */}
            <div className="flex items-center justify-end gap-1.5 sm:gap-2 mb-3 flex-shrink-0 flex-wrap">
                <button
                    onClick={() => {
                        const chars = (generatedOutput.characters || []);
                        const scns = (generatedOutput.scenes || []);
                        const mt = generatedOutput.meta_data || generatedOutput.metadata || {};
                        const bp = generatedOutput.creative_blueprint || {};
                        const line = '═'.repeat(60);
                        const thinLine = '─'.repeat(60);
                        const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

                        let txt = '';
                        txt += `${line}\n`;
                        txt += `  KEMO ENGINE — VIDEO SCENARIO\n`;
                        txt += `  Generated: ${date}\n`;
                        if (mt.recommended_style) txt += `  Style: ${mt.recommended_style}\n`;
                        if (mt.recommended_genre) txt += `  Genre: ${mt.recommended_genre}\n`;
                        if (mt.detected_aspect_ratio) txt += `  Aspect Ratio: ${mt.detected_aspect_ratio}\n`;
                        txt += `  Scenes: ${scns.length} | Characters: ${chars.length}\n`;
                        txt += `${line}\n\n`;

                        // Creative Blueprint
                        if (bp.plan_summary || bp.audience_hook) {
                            txt += `📋 DIRECTOR'S VISION\n${thinLine}\n`;
                            if (bp.plan_summary) txt += `  Plan: ${bp.plan_summary}\n`;
                            if (bp.audience_hook) txt += `  Hook: ${bp.audience_hook}\n`;
                            if (bp.visual_philosophy) txt += `  Visual: ${bp.visual_philosophy}\n`;
                            txt += `\n`;
                        }

                        // Characters
                        if (chars.length > 0) {
                            txt += `🎭 CHARACTERS\n${thinLine}\n`;
                            chars.forEach((c, i) => {
                                const name = c.name_en || c.name || `Character ${i + 1}`;
                                const nameAr = c.name_ar ? ` (${c.name_ar})` : '';
                                txt += `  ${i + 1}. ${name}${nameAr}\n`;
                                if (c.description) txt += `     ${c.description}\n`;
                                if (c.visual_prompt) txt += `     🖼 Prompt: ${c.visual_prompt}\n`;
                                txt += `\n`;
                            });
                        }

                        // Scenes
                        if (scns.length > 0) {
                            txt += `🎬 SCENES\n${line}\n\n`;
                            scns.forEach((s, i) => {
                                const num = s.scene_number || i + 1;
                                txt += `  ┌─ SCENE ${num} ${s.duration ? `(${s.duration})` : ''} ${s.shot_type ? `• ${s.shot_type}` : ''}\n`;
                                txt += `  │\n`;
                                const vis = s.visual_script || s.script_en || s.visual || '';
                                const dlg = s.dialogue_script || s.dialogue_ar || s.dialogue || '';
                                const aud = s.audio_notes || s.audio || '';
                                if (vis) txt += `  │  📽️ Visual Script\n  │  ${vis}\n  │\n`;
                                if (dlg) txt += `  │  💬 Dialogue\n  │  ${dlg}\n  │\n`;
                                if (aud) txt += `  │  🔊 Audio\n  │  ${aud}\n  │\n`;
                                const imgPrompt = s.image_prompts?.scene_prompt || s.scene_prompt || '';
                                const negPrompt = s.negative_prompt || s.image_prompts?.negative_prompt || '';
                                if (imgPrompt) txt += `  │  🎨 Image Prompt\n  │  ${imgPrompt}\n  │\n`;
                                if (negPrompt) txt += `  │  ⛔ Negative: ${negPrompt}\n  │\n`;
                                txt += `  └${'─'.repeat(58)}\n\n`;
                            });
                        }

                        // Master prompt
                        if (mt.master_visual_prompt) {
                            txt += `🎯 MASTER VISUAL PROMPT\n${thinLine}\n`;
                            txt += `  ${mt.master_visual_prompt}\n\n`;
                        }

                        txt += `${line}\n  End of Scenario — Kemo Prompt\n${line}\n`;

                        const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `kemo-scenario-${new Date().toISOString().slice(0, 10)}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                >
                    <Download className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'تصدير TXT' : 'Export TXT'}
                </button>
                <button
                    onClick={() => {
                        const blob = new Blob([JSON.stringify(generatedOutput, null, 2)], { type: 'application/json;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `kemo-scenario-${new Date().toISOString().slice(0, 10)}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                >
                    <FileJson className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'تصدير JSON' : 'Export JSON'}
                </button>
                <button
                    onClick={() => {
                        setGeneratedOutput(null);
                        localStorage.removeItem('kemo-last-scenario');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'مسح' : 'Clear'}
                </button>
            </div>
            {/* Title & Logline */}
            {(meta.title || meta.logline) && (
                <div className={`mb-3 px-3 py-2.5 rounded-xl border bg-gradient-to-br from-primary/5 to-transparent ${isRTL ? 'text-right' : ''}`} style={{ borderColor: 'var(--accent-primary)', opacity: 0.9 }}>
                    {meta.title && (
                        <h2 className="text-sm sm:text-base font-bold mb-0.5" style={{ color: 'var(--text-primary)' }} dir={isRTL ? 'rtl' : 'ltr'}>
                            🎬 {meta.title}
                        </h2>
                    )}
                    {meta.logline && (
                        <p className="text-xs text-text2 leading-snug" dir={isRTL ? 'rtl' : 'ltr'}>{meta.logline}</p>
                    )}
                </div>
            )}

            {/* Creative Blueprint - Director's Vision */}
            {blueprint && (
                <div className="mb-3 rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'var(--accent-primary)' }}>
                    <button
                        onClick={() => setVisionCollapsed(!visionCollapsed)}
                        className={`w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="p-1 rounded-md bg-blue-500/10">
                                <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                                {language === 'ar' ? 'رؤية المخرج' : "Director's Vision"}
                            </span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform duration-200 ${visionCollapsed ? '' : 'rotate-180'}`} />
                    </button>
                    {!visionCollapsed && (
                        <div className="px-3 pb-3 space-y-1.5" style={{ animation: 'slideUp 0.15s ease-out' }}>
                            {blueprint.plan_summary && (
                                <p className="text-xs leading-snug" style={{ color: 'var(--text-secondary)' }} dir={isRTL ? 'rtl' : 'ltr'}>
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">📋 </span>
                                    {blueprint.plan_summary}
                                </p>
                            )}
                            {blueprint.audience_hook && (
                                <p className="text-xs leading-snug" style={{ color: 'var(--text-secondary)' }} dir={isRTL ? 'rtl' : 'ltr'}>
                                    <span className="font-semibold text-amber-500">🎣 </span>
                                    {blueprint.audience_hook}
                                </p>
                            )}
                            {blueprint.visual_arc && (
                                <p className="text-xs leading-snug" style={{ color: 'var(--text-secondary)' }} dir={isRTL ? 'rtl' : 'ltr'}>
                                    <span className="font-semibold text-cyan-500">🎨 </span>
                                    {blueprint.visual_arc}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {meta.concept_used && (
                <div className={`meta-summary mb-4 ${isRTL ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-xs font-semibold text-indigo-300">
                            {language === 'ar' ? 'الفكرة المنفذة' : 'Concept'}
                        </span>
                    </div>
                    <p className="text-sm text-text2" dir={isRTL ? 'rtl' : 'ltr'}>{meta.concept_used}</p>
                    <div className={`flex items-center gap-3 mt-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {meta.visual_style_applied && <span className="meta-tag">🎨 {meta.visual_style_applied}</span>}
                        {meta.genre_applied && <span className="meta-tag">🎬 {meta.genre_applied}</span>}
                        {meta.scene_count_target && <span className="meta-tag">📽️ {meta.scene_count_target} {language === 'ar' ? 'مشاهد' : 'scenes'}</span>}
                        {meta.total_estimated_duration && <span className="meta-tag">⏱️ {meta.total_estimated_duration}</span>}
                    </div>
                </div>
            )}

            <div className={`flex gap-2 mb-4 p-1 rounded-xl bg-black/20 dark:bg-black/30 border border-white/5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const count = tab.id === 'characters' ? characters.length : scenes.length;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''} ${isActive
                                ? 'bg-primary/20 text-primary shadow-sm border border-primary/30'
                                : 'text-text2 hover:text-text1 hover:bg-white/5'
                                }`}
                        >
                            <tab.icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                            <span>{safeT(tab.labelKey, tab.fallback)}</span>
                            {count > 0 && (
                                <span className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-xs font-bold ${isActive
                                    ? 'bg-primary/30 text-primary'
                                    : 'bg-white/10 text-text2'
                                    }`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="flex-1 overflow-auto space-y-2 pr-1">
                {activeTab === 'characters' && (
                    characters.length > 0
                        ? characters.map((char, i) => <CharacterCard key={i} char={char} index={i} isRTL={isRTL} language={language} />)
                        : <div className="text-center py-12 text-muted text-sm">{language === 'ar' ? 'لا توجد بيانات شخصيات' : 'No character data'}</div>
                )}
                {activeTab === 'screenplay' && (
                    scenes.length > 0 ? (
                        <>
                            {/* Consistency audit — character and style drift across scenes.
                                Silent when clean, so it only ever costs attention when
                                there is something to act on. */}
                            {audit.issues.length > 0 && (
                                <div
                                    className="mb-4 rounded-xl border p-3.5"
                                    style={{
                                        background: audit.stats.high_severity > 0 ? 'rgba(239,68,68,0.07)' : 'rgba(245,158,11,0.07)',
                                        borderColor: audit.stats.high_severity > 0 ? 'rgba(239,68,68,0.28)' : 'rgba(245,158,11,0.28)',
                                    }}
                                >
                                    <p className="text-sm font-semibold text-text1">
                                        {language === 'ar'
                                            ? `تنبيه ثبات — ${audit.issues.length} ملاحظة`
                                            : `Consistency check — ${audit.issues.length} finding${audit.issues.length > 1 ? 's' : ''}`}
                                    </p>
                                    <p className="mt-1 text-[11px] text-muted">
                                        {language === 'ar'
                                            ? 'المشاهد دي ممكن تطلع بشخصية أو أسلوب مختلف. أعِد توليد المشهد لوحده لإصلاحه.'
                                            : 'These scenes may render with a different character or style. Regenerate the scene to fix it.'}
                                    </p>
                                    <ul className="mt-2.5 space-y-1">
                                        {audit.issues.slice(0, 5).map((issue, i) => (
                                            <li key={`${issue.scene}-${issue.type}-${i}`} className="flex items-start gap-2 text-xs text-text2">
                                                <span
                                                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                                                    style={{ background: issue.severity === 'high' ? '#ef4444' : issue.severity === 'medium' ? '#f59e0b' : '#64748b' }}
                                                    aria-hidden="true"
                                                />
                                                <span>{issue.message}</span>
                                            </li>
                                        ))}
                                        {audit.issues.length > 5 && (
                                            <li className="text-[11px] text-muted">
                                                {language === 'ar'
                                                    ? `و${audit.issues.length - 5} ملاحظة أخرى`
                                                    : `and ${audit.issues.length - 5} more`}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Master Visual Prompt (Reference Image) */}
                            {meta?.master_visual_prompt && (
                                <div className="mb-4 fade-in">
                                    <div className="p-3 sm:p-4 rounded-xl border bg-gradient-to-br from-amber-900/20 to-transparent" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">🖼</span>
                                                <span className="text-sm font-bold text-amber-200">
                                                    {language === 'ar' ? 'البرومبت المرجعي (Scene 0)' : 'Master Visual Prompt (Scene 0)'}
                                                </span>
                                            </div>
                                            <CopyBtn text={meta.master_visual_prompt} />
                                        </div>
                                        <p className="text-sm text-amber-50/80 leading-relaxed font-mono bg-black/30 p-3 rounded-lg border border-amber-500/20 whitespace-pre-wrap">
                                            {meta.master_visual_prompt}
                                        </p>
                                        <p className="mt-2 text-[10px] text-amber-500/50">{language === 'ar' ? '💡 ولّد ده مرة واحدة واستخدمه كمرجع (CREF) لكل المشاهد' : '💡 Generate this once, then use as CREF for all scenes'}</p>
                                    </div>
                                </div>
                            )}

                            {/* Scene Cards — Accordion.
                                Handlers come from stable useCallbacks above rather than
                                inline arrows: a new function identity on every render
                                defeats React.memo on SceneCard entirely, so all scenes
                                re-rendered whenever any one of them was touched.

                                The key is the scene number, not the array index — with an
                                index key React reuses the wrong card's inline edit state
                                if scenes are ever reordered or removed. */}
                            {scenes.map((scene, i) => (
                                <SceneCard
                                    key={scene.scene_number ?? `scene-${i}`}
                                    scene={scene}
                                    index={i}
                                    isRTL={isRTL}
                                    language={language}
                                    isExpanded={expandedScene === i}
                                    onToggle={handleToggleScene}
                                    isRegenerating={regeneratingScene === i}
                                    onRegenerateScene={handleRegenerateScene}
                                    onUpdateScene={handleUpdateScene}
                                />
                            ))}
                        </>
                    ) : (
                        <div className="text-center py-12 text-muted text-sm">{language === 'ar' ? 'لا توجد مشاهد' : 'No scenes'}</div>
                    )
                )}
            </div>

            {/* Parsed to nothing usable.
                This used to dump the entire raw JSON payload on screen, which
                is developer diagnostics — not something to hand a customer who
                just spent credits. They get a plain explanation and a way
                forward; the payload goes to the console for debugging. */}
            {characters.length === 0 && scenes.length === 0 && (
                <div className="mt-4 rounded-xl border p-4"
                    style={{ background: 'var(--overlay-4)', borderColor: 'var(--border-color)' }}>
                    <p className="text-sm font-medium text-text1">
                        {language === 'ar'
                            ? 'الاستجابة وصلت بشكل غير متوقع'
                            : 'The response came back in an unexpected shape'}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">
                        {language === 'ar'
                            ? 'رصيدك اتخصم مرة واحدة بس. جرّب تولّد تاني — وغالباً تبسيط الفكرة أو تقليل عدد المشاهد بيحل المشكلة.'
                            : 'You were charged once. Try generating again — simplifying the idea or lowering the scene count usually resolves it.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ResultsPanel;
