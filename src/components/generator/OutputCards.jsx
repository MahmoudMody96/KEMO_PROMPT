import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import {
    Film, Mic, Volume2, Image, Pencil, Check, Copy, ChevronDown, RefreshCw, Loader2
} from 'lucide-react';
import { scoreScenePrompt } from './QualityValidation';

import { useCopyFeedback } from '../../lib/useCopyFeedback';

// Module scope: a fresh object literal per render was being allocated for every
// scene card purely to look up one key.
const GRADE_COLORS = {
    'A+': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'A': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    'B+': 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    'B': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'C': 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    'D': 'bg-red-500/15 text-red-400 border-red-500/25',
};


// ===========================
// COPY BUTTON HELPER
// ===========================
export const CopyBtn = ({ text, label, className = '' }) => {
    const { language } = useAppContext();
    const { copied, copy } = useCopyFeedback();
    const handleCopy = () => copy(text || '');
    return (
        <button onClick={handleCopy} className={`copy-btn ${className}`} title={label || (language === 'ar' ? 'نسخ' : 'Copy')}>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
    );
};

// ===========================
// CHARACTER CARD
// ===========================
// Memoised: ResultsPanel re-renders on every accordion toggle and inline edit,
// which re-rendered every card in the list even though only one changed.
export const CharacterCard = React.memo(function CharacterCard({ char, index, isRTL, language }) {
    const name = char.name_ar || char.name || char.name_en || (language === 'ar' ? `شخصية ${index + 1}` : `Character ${index + 1}`);
    const role = char.role || '';

    // New fields: screenplay_description and image_prompt
    const screenplayDesc = char.screenplay_description || '';
    const imagePrompt = char.image_prompt || '';

    // Fallback to old fields for backward compatibility
    const desc = screenplayDesc || char.visual_desc_en || char.description || char.visual_description || '';

    const getPersonalityString = (p) => {
        if (!p) return '';
        if (typeof p === 'string') return p;
        if (typeof p === 'object') {
            const { core_trait, speech_pattern, mannerism } = p;
            if (core_trait) return `${core_trait}. ${speech_pattern || ''} ${mannerism || ''}`.trim();
            return Object.values(p).filter(v => typeof v === 'string').join('. ');
        }
        return '';
    };
    const personality = getPersonalityString(char.personality || char.traits);

    const roleColors = {
        'Protagonist': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        'Antagonist': 'bg-red-500/20 text-red-300 border-red-500/30',
        'Supporting': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        'Reluctant Hero': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        'Hero': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        'The Comic Relief': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    };
    const roleClass = roleColors[role] || 'bg-zinc-700/30 text-text2 border-zinc-600/30';
    const avatarEmojis = ['🎭', '👤', '🎬', '🌟', '🎪', '🎨'];

    return (
        <div className="bg-bg1/50 border border-border rounded-lg p-3 sm:p-4 mb-3 fade-in hover:border-primary/30 transition-colors" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="character-avatar">{avatarEmojis[index % avatarEmojis.length]}</div>
                <div className="flex-1 min-w-0">
                    <div className={`flex items-center gap-2 mb-1 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <h4 className="font-bold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>{name}</h4>
                        {role && <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${roleClass}`}>{role}</span>}
                    </div>
                    {desc && (
                        <div className="mt-2">
                            <p className="text-xs text-muted uppercase tracking-wide mb-1">📝 {language === 'ar' ? 'وصف الشخصية' : 'Screenplay Description'}</p>
                            <p className="text-xs sm:text-sm text-text2 leading-relaxed font-mono bg-zinc-800/50 p-2 rounded border border-zinc-700/50 break-words overflow-x-auto" dir={isRTL ? 'rtl' : 'ltr'}>
                                {desc}
                            </p>
                        </div>
                    )}
                    {imagePrompt && (
                        <div className="mt-2">
                            <p className="text-xs text-muted uppercase tracking-wide mb-1">🖼️ {language === 'ar' ? 'برومبت الصورة' : 'Image Prompt'}</p>
                            <p className="text-xs sm:text-sm text-emerald-300 leading-relaxed bg-emerald-950/30 p-2 rounded border border-emerald-700/30 break-words overflow-x-auto">
                                {imagePrompt}
                            </p>
                        </div>
                    )}
                    {personality && <p className="text-xs text-muted mt-2 italic" dir={isRTL ? 'rtl' : 'ltr'}>✨ {personality}</p>}
                </div>
                <CopyBtn text={`${name}\n${role}\n${desc}\n\nImage Prompt:\n${imagePrompt}`} />
            </div>
        </div>
    );
});

// ===========================
// SCENE CARD (Accordion)
// ===========================
// Defined at module scope, NOT inside SceneCard. A component created during
// render gets a new identity on every keystroke, so React unmounts and remounts
// the textarea and the caret jumps out after each character.
const EditBtn = ({ onEdit, language }) => (
    <button
        onClick={onEdit}
        className="p-1 rounded-md hover:bg-white/10 text-muted hover:text-primary transition-colors opacity-0 group-hover/section:opacity-100"
        title={language === 'ar' ? 'تعديل' : 'Edit'}
    >
        <Pencil className="w-3 h-3" />
    </button>
);

const EditableSection = ({
    field, value, icon: SectionIcon, iconColor, label,
    dir = 'ltr', textClass = '',
    isRTL, language, editing, editValue, setEditValue,
    textareaRef, onStartEdit, onSave, onCancel,
}) => (
    <div className="scene-section group/section">
        <div className={`scene-section-label ${isRTL ? 'flex-row-reverse' : ''}`}>
            <SectionIcon className={`w-3.5 h-3.5 ${iconColor}`} />
            <span className="flex-1">{label}</span>
            {editing !== field && (
                <EditBtn onEdit={() => onStartEdit(field, value)} language={language} />
            )}
        </div>
        {editing === field ? (
            <div className="mt-1">
                <textarea
                    ref={textareaRef}
                    value={editValue}
                    onChange={(e) => {
                        setEditValue(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    className="w-full bg-bg0 border border-primary/40 rounded-lg p-2.5 text-sm text-text1 outline-none resize-none focus:ring-2 focus:ring-primary/25 transition-all"
                    dir={dir}
                />
                <div className="flex items-center gap-1.5 mt-1.5">
                    <button onClick={onSave} className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors">
                        <Check className="w-3 h-3" /> {language === 'ar' ? 'حفظ' : 'Save'}
                    </button>
                    <button onClick={onCancel} className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-500/15 text-text2 hover:bg-zinc-500/25 transition-colors">
                        {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                </div>
            </div>
        ) : (
            <p className={`scene-section-content ${textClass}`} dir={dir}>{value}</p>
        )}
    </div>
);

export const SceneCard = React.memo(function SceneCard({ scene, index, isRTL, language, onUpdateScene, isExpanded = true, onToggle, onRegenerateScene, isRegenerating }) {
    const getSafeString = (val) => {
        if (!val) return '';
        if (typeof val === 'string') return val;
        if (typeof val === 'object') return Object.values(val).filter(v => typeof v === 'string').join('. ');
        return String(val);
    };

    const num = scene.scene_number || index + 1;
    const visual = getSafeString(scene.visual_script || scene.script_en || scene.visual);
    const dialogue = getSafeString(scene.dialogue_script || scene.dialogue_ar || scene.dialogue);
    const audio = getSafeString(scene.audio_notes || scene.audio);

    // Image Prompt fields
    const scenePrompt = getSafeString(scene.image_prompts?.scene_prompt || scene.scene_prompt);
    const negativePrompt = getSafeString(scene.negative_prompt || scene.image_prompts?.negative_prompt);

    const quality = useMemo(
        () => (scenePrompt ? scoreScenePrompt(scenePrompt) : null),
        [scenePrompt]
    );

    // Inline edit state
    const [editing, setEditing] = useState(null);
    const [editValue, setEditValue] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (editing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [editing]);

    const startEdit = (field, value) => {
        setEditing(field);
        setEditValue(value);
    };

    const saveEdit = () => {
        if (!editing || !onUpdateScene) return;
        const fieldMap = {
            visual: scene.visual_script !== undefined ? 'visual_script' : scene.script_en !== undefined ? 'script_en' : 'visual',
            dialogue: scene.dialogue_script !== undefined ? 'dialogue_script' : scene.dialogue_ar !== undefined ? 'dialogue_ar' : 'dialogue',
            audio: scene.audio_notes !== undefined ? 'audio_notes' : 'audio',
        };
        onUpdateScene(index, fieldMap[editing], editValue);
        setEditing(null);
        setEditValue('');
    };

    const cancelEdit = () => {
        setEditing(null);
        setEditValue('');
    };

    // Props shared by every EditableSection in this card.
    const editProps = {
        isRTL, language, editing, editValue, setEditValue, textareaRef,
        onStartEdit: startEdit, onSave: saveEdit, onCancel: cancelEdit,
    };

    // Summary for collapsed state
    const collapsedSummary = visual ? (visual.length > 80 ? visual.substring(0, 80) + '...' : visual) : (dialogue ? (dialogue.length > 60 ? dialogue.substring(0, 60) + '...' : dialogue) : '');

    return (
        <div className="bg-bg1/50 border border-border rounded-lg overflow-hidden fade-in hover:border-primary/30 transition-colors" style={{ animationDelay: `${index * 0.06}s` }}>
            {/* Accordion Header.
                The row is a <div>, not a <button>. It used to be a button that
                contained the regenerate and copy buttons — nested interactive
                elements are invalid HTML, and browsers resolve them
                inconsistently: the inner controls may be unreachable by
                keyboard or may fire the outer toggle instead. The toggle is now
                its own button covering the title area, with the actions as
                siblings beside it. */}
            <div
                className={`flex w-full items-center justify-between p-3 transition-colors hover:bg-white/5 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
                <button
                    type="button"
                    onClick={() => onToggle?.(index)}
                    aria-expanded={isExpanded}
                    className={`flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-start ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                    <div className="scene-number">{num}</div>
                    <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                            {language === 'ar' ? `مشهد ${num}` : `Scene ${num}`}
                            {scene.duration && <span className="text-xs text-muted ml-2">({scene.duration})</span>}
                        </span>
                        {!isExpanded && collapsedSummary && (
                            <span className="text-xs text-muted mt-0.5 line-clamp-1" dir="auto">{collapsedSummary}</span>
                        )}
                    </div>
                    {/* Quality score. Computed in a memo keyed on the prompt
                        rather than an IIFE in the JSX — the IIFE re-scored every
                        scene on every render, and this list re-renders on each
                        accordion toggle. The colour map is module-level for the
                        same reason. */}
                    {scenePrompt && quality && (
                        <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full border font-bold ${GRADE_COLORS[quality.grade] || GRADE_COLORS.D}`}
                            title={`${quality.score}/100 — ${quality.feedback}`}
                        >
                            {quality.grade}
                        </span>
                    )}
                </button>

                <div className="flex shrink-0 items-center gap-1.5">
                    {isExpanded && !isRegenerating && onRegenerateScene && (
                        <button
                            type="button"
                            onClick={() => onRegenerateScene(index)}
                            className="p-1 rounded-md hover:bg-amber-500/15 text-muted hover:text-amber-400 transition-colors"
                            title={language === 'ar' ? 'إعادة توليد هذا المشهد' : 'Regenerate this scene'}
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                    )}
                    {isRegenerating && <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
                    {isExpanded && <CopyBtn text={`Scene ${num}\n\nVisual:\n${visual}\n\nDialogue:\n${dialogue}\n\nAudio:\n${audio}`} />}
                    {/* Decorative: the toggle button already conveys the state
                        via aria-expanded, so this must not be announced twice. */}
                    <ChevronDown
                        aria-hidden="true"
                        className={`w-3.5 h-3.5 text-muted transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {/* Accordion Body */}
            {isExpanded && (
                <div className="px-3 pb-3 space-y-1.5" style={{ animation: 'slideUp 0.15s ease-out' }}>
                    {visual && (
                        <EditableSection {...editProps} field="visual" value={visual} icon={Film} iconColor="text-blue-400" label={language === 'ar' ? 'السيناريو البصري' : 'Visual Script'} dir="ltr" />
                    )}

                    {dialogue && (
                        <EditableSection {...editProps} field="dialogue" value={dialogue} icon={Mic} iconColor="text-emerald-400" label={language === 'ar' ? 'الحوار' : 'Dialogue'} dir="rtl" />
                    )}

                    {audio && (
                        <EditableSection {...editProps} field="audio" value={audio} icon={Volume2} iconColor="text-amber-400" label={language === 'ar' ? 'ملاحظات صوتية' : 'Audio Notes'} dir={isRTL ? 'rtl' : 'ltr'} textClass="text-muted" />
                    )}

                    {/* Image Prompt */}
                    {scenePrompt && (
                        <div className="mt-2 pt-2 border-t border-dashed" style={{ borderColor: 'var(--border-light)' }}>
                            <div className="rounded-lg p-2.5" style={{ backgroundColor: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
                                <div className={`flex items-center justify-between mb-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <Image className="w-3 h-3 text-blue-400" />
                                        <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wide">
                                            {language === 'ar' ? 'برومبت الصورة' : 'Image Prompt'}
                                        </span>
                                    </div>
                                    <CopyBtn text={scenePrompt} />
                                </div>
                                <p className="text-xs leading-snug font-mono whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
                                    {scenePrompt}
                                </p>

                                {negativePrompt && (
                                    <div className="mt-1.5 pt-1.5 border-t" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
                                        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <span className="text-[10px] font-semibold text-[var(--danger-fg)] uppercase tracking-wide">⛔ {language === 'ar' ? 'سلبي' : 'Negative'}</span>
                                            <CopyBtn text={negativePrompt} />
                                        </div>
                                        <p className="text-[11px] text-[var(--danger-fg)] leading-snug font-mono mt-0.5">{negativePrompt}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

// ===========================
// MASTER PROMPT CARD
// ===========================
export const MasterPromptCard = ({ prompt, isRTL, language }) => {
    if (!prompt) return null;
    return (
        <div className="mb-6 fade-in p-3 sm:p-5 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-900/20 to-transparent">
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/30">
                    <span className="text-2xl">🖍️</span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <h3 className="text-lg font-bold text-amber-100">
                            {language === 'ar' ? 'المشهد الرئيسي (Master Visual Prompt)' : 'Master Visual Prompt'}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {language === 'ar' ? 'صورة مرجعية' : 'Reference Image'}
                        </span>
                    </div>
                    <div className="relative group/master">
                        <p className="text-sm text-amber-50/90 leading-relaxed font-mono bg-black/40 p-4 rounded-lg border border-amber-500/20">
                            {prompt}
                        </p>
                        <CopyBtn text={prompt} className="absolute top-2 right-2 opacity-0 group-hover/master:opacity-100 transition-opacity" />
                    </div>
                    <p className="mt-2 text-xs text-amber-500/60">
                        {language === 'ar'
                            ? '💡 استخدم هذا البرومبت لتوليد صورة مرجعية (Character Reference) لجميع المشاهد الأخرى.'
                            : '💡 Use this prompt to generate a consistent Character Reference (CREF) for all other scenes.'}
                    </p>
                </div>
            </div>
        </div>
    );
};
