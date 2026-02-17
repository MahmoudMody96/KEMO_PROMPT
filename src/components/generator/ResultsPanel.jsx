import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import {
    UserCircle, Film, Sparkles, ChevronDown, Download, Trash2, Zap
} from 'lucide-react';
import { CharacterCard, SceneCard, CopyBtn } from './OutputCards';
import GeneratingState from './GeneratingState';

const ResultsPanel = () => {

    const [activeTab, setActiveTab] = useState('characters');
    const [visionCollapsed, setVisionCollapsed] = useState(true);
    const [expandedScene, setExpandedScene] = useState(0);
    const { generatedOutput, setGeneratedOutput, isGenerating, generationProgress, t, isRTL, language } = useAppContext();
    const safeT = (key, fallback = '') => { const val = t?.(key); return (val && val !== key) ? val : fallback; };

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

    if (isGenerating) return <GeneratingState language={language} progress={generationProgress} />;

    if (!generatedOutput) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 md:px-8 relative overflow-hidden">
                {/* Document canvas pseudo-elements */}
                <div className="absolute pointer-events-none" style={{
                    width: 420, maxWidth: '70%', height: '70%',
                    borderRadius: 14,
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                    filter: 'blur(0.2px)',
                }} />
                <div className="absolute pointer-events-none" style={{
                    top: '22%', width: 280, height: 6, borderRadius: 4,
                    background: 'rgba(255,255,255,0.05)',
                }} />
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(108,92,255,0.06),transparent_70%)] pointer-events-none" />
                <div className="relative mb-5 p-5 rounded-full bg-surface border border-primary/10 shadow-card" style={{ opacity: 0.7, transform: 'scale(0.9)' }}>
                    <Sparkles className="w-7 h-7 text-primary animate-pulse" />
                </div>
                <h3 className="text-base font-semibold mb-1.5 text-text1" style={{ opacity: 0.9 }}>{safeT('readyToCreate', 'Ready to Create')}</h3>
                <p className="text-xs text-text2 max-w-[240px] leading-snug mb-5" style={{ opacity: 0.7 }}>{safeT('fillParams', 'Fill in the parameters and click Generate.')}</p>

                <div className="flex items-center gap-3 text-[10px] text-muted opacity-40">
                    <div className="w-6 h-px bg-border" />
                    <span>Kemo Engine v9.0</span>
                    <div className="w-6 h-px bg-border" />
                </div>
            </div>
        );
    }

    const characters = getCharacters(generatedOutput);
    const scenes = getScenes(generatedOutput);
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

                        txt += `${line}\n  End of Scenario — Kemo Engine\n${line}\n`;

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
                        setGeneratedOutput(null);
                        localStorage.removeItem('kemo-last-scenario');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'مسح' : 'Clear'}
                </button>
            </div>
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
                    <p className="text-sm text-zinc-300" dir={isRTL ? 'rtl' : 'ltr'}>{meta.concept_used}</p>
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
                        : <div className="text-center py-12 text-zinc-500 text-sm">{language === 'ar' ? 'لا توجد بيانات شخصيات' : 'No character data'}</div>
                )}
                {activeTab === 'screenplay' && (
                    scenes.length > 0 ? (
                        <>
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

                            {/* Scene Cards — Accordion */}
                            {scenes.map((scene, i) => <SceneCard key={i} scene={scene} index={i} isRTL={isRTL} language={language}
                                isExpanded={expandedScene === i}
                                onToggle={() => setExpandedScene(expandedScene === i ? -1 : i)}
                                onUpdateScene={(sceneIndex, field, value) => {
                                    const updated = { ...generatedOutput };
                                    const scenesArr = updated.scenes || updated.sceneDirectives;
                                    if (scenesArr && scenesArr[sceneIndex]) {
                                        scenesArr[sceneIndex] = { ...scenesArr[sceneIndex], [field]: value };
                                        setGeneratedOutput({ ...updated });
                                    }
                                }}
                            />)}
                        </>
                    ) : (
                        <div className="text-center py-12 text-zinc-500 text-sm">{language === 'ar' ? 'لا توجد مشاهد' : 'No scenes'}</div>
                    )
                )}
            </div>

            {characters.length === 0 && scenes.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-400 text-xs mb-2">{language === 'ar' ? 'تشخيص: استجابة الـ API الخام' : 'Debug: Raw API Response'}</p>
                    <pre className="text-xs text-zinc-400 overflow-auto max-h-40">
                        {JSON.stringify(generatedOutput, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default ResultsPanel;
