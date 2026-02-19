import React, { useState } from 'react';
import { search_viral_trends, generate_from_trend } from '../../api/promptApi';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import { Search, Sparkles, TrendingUp, Eye, Zap, Wrench, ArrowRight, RotateCcw, Copy, Check, Music, Shield, Monitor, X, Settings2 } from 'lucide-react';
import HelpTooltip from '../ui/HelpTooltip';

// State Machine States
const STATES = {
    SEARCH: 'search',
    SELECTING: 'selecting',
    GENERATING: 'generating',
    RESULT: 'result'
};

// Platform options
const PLATFORMS = [
    { id: 'general', icon: '🌐' },
    { id: 'tiktok', icon: '🎵' },
    { id: 'shorts', icon: '▶️' },
    { id: 'reels', icon: '📸' },
];

// Region options
const REGIONS = [
    { id: 'global', icon: '🌍' },
    { id: 'egypt', icon: '🇪🇬' },
    { id: 'saudi', icon: '🇸🇦' },
    { id: 'uae', icon: '🇦🇪' },
    { id: 'usa', icon: '🇺🇸' },
    { id: 'uk', icon: '🇬🇧' },
    { id: 'morocco', icon: '🇲🇦' },
];

// Simple genre/character/dialect options for DNA modal
const GENRE_OPTIONS = [
    'Comedy', 'Horror', 'Medical', 'Educational', 'Marketing',
    'Documentary', 'Viral', 'Drama', 'Cooking', 'Tech', 'Sports'
];
const CHARACTER_OPTIONS = [
    'Human', 'Cat', 'Dog', 'Robot', 'Food Character', 'Object Character',
    'Alien', 'Monster', 'Superhero', 'Historical Figure'
];
const DIALECT_OPTIONS = [
    'Egyptian Arabic (Masri)', 'Gulf Arabic (Khaleeji)', 'Levantine Arabic (Shami)',
    'Moroccan Arabic (Darija)', 'Standard Arabic (Fusha)', 'English', 'Franco-Arabic'
];

// ViralMeter component
const ViralMeter = ({ score }) => {
    const numScore = parseInt(score) || 0;
    const percentage = Math.min(100, Math.max(0, numScore));
    const getColor = (s) => {
        if (s >= 90) return { bar: 'from-green-500 to-emerald-400', text: 'text-green-400', bg: 'bg-green-500/10' };
        if (s >= 80) return { bar: 'from-yellow-500 to-amber-400', text: 'text-yellow-400', bg: 'bg-yellow-500/10' };
        return { bar: 'from-orange-500 to-red-400', text: 'text-orange-400', bg: 'bg-orange-500/10' };
    };
    const colors = getColor(numScore);

    return (
        <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${colors.bg} border border-white/5`}>
            <span className="text-xs">🔥</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden min-w-[40px]">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-700`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className={`text-xs font-bold ${colors.text} tabular-nums`}>{numScore}</span>
        </div>
    );
};

// DNA Modal component
const DNAModal = ({ isOpen, onClose, onGenerate, t, isRTL, textDir }) => {
    const [genre, setGenre] = useState('');
    const [character, setCharacter] = useState('');
    const [dialect, setDialect] = useState('');

    if (!isOpen) return null;

    const selectClass = `w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-colors appearance-none cursor-pointer`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-[#151C31] border border-white/10 rounded-2xl p-5 w-full max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                dir={textDir}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <div className="flex items-center gap-2.5" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            <Settings2 className="w-4.5 h-4.5 text-white" />
                        </div>
                        <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                            <h3 className="text-white font-bold text-sm">{t('customizeBlueprint')}</h3>
                            <p className="text-muted text-[10px]">{t('optional')}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-muted hover:text-white transition-colors p-1">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Fields */}
                <div className="space-y-3.5 mb-5">
                    {/* Genre */}
                    <div>
                        <label className="text-[11px] text-muted font-semibold mb-1.5 block" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                            🎭 {t('genre')}
                        </label>
                        <select value={genre} onChange={(e) => setGenre(e.target.value)} className={selectClass}>
                            <option value="">{t('selectGenre')}</option>
                            {GENRE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>

                    {/* Character */}
                    <div>
                        <label className="text-[11px] text-muted font-semibold mb-1.5 block" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                            🎬 {t('characterType')}
                        </label>
                        <select value={character} onChange={(e) => setCharacter(e.target.value)} className={selectClass}>
                            <option value="">{t('selectCharacter')}</option>
                            {CHARACTER_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Dialect */}
                    <div>
                        <label className="text-[11px] text-muted font-semibold mb-1.5 block" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                            🗣️ {t('dialect')}
                        </label>
                        <select value={dialect} onChange={(e) => setDialect(e.target.value)} className={selectClass}>
                            <option value="">{t('selectDialect')}</option>
                            {DIALECT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <button
                        onClick={() => onGenerate({ genre, character, dialect })}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                        style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
                    >
                        <Sparkles className="w-4 h-4" />
                        {t('generateNow')}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-muted hover:text-white border border-white/10 rounded-xl text-sm transition-all"
                    >
                        {t('cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const TrendHunter = () => {
    const { setActiveTab, updateGeneratorInput, t, language, isRTL, textDir, flexDir } = useAppContext();
    const toast = useToast();

    const [state, setState] = useState(STATES.SEARCH);
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState('general');
    const [region, setRegion] = useState('global');
    const [trendOptions, setTrendOptions] = useState([]);
    const [selectedTrend, setSelectedTrend] = useState(null);
    const [blueprint, setBlueprint] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [copied, setCopied] = useState(false);
    // DNA Modal state
    const [showDNAModal, setShowDNAModal] = useState(false);
    const [pendingTrend, setPendingTrend] = useState(null);

    // Stage 1: Search for viral trends
    const handleSearch = async () => {
        if (!topic.trim()) {
            toast.warning(t('enterCoreIdea'));
            return;
        }

        setIsLoading(true);
        setLoadingMessage(t('scanning'));

        try {
            const result = await search_viral_trends(topic, language, platform, region);
            if (Array.isArray(result) && result.length > 0) {
                setTrendOptions(result);
                setState(STATES.SELECTING);
            } else {
                setTrendOptions([]);
                setState(STATES.SELECTING);
            }
        } catch (error) {
            console.error('Trend search error:', error);
            toast.error(t('errorOccurred') + ': ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Open DNA modal before generating
    const handleGenerateClick = (trend) => {
        setPendingTrend(trend);
        setShowDNAModal(true);
    };

    // Stage 2: Generate blueprint from selected trend (with DNA options)
    const handleGenerate = async (trend, dnaOptions = {}) => {
        setShowDNAModal(false);
        setSelectedTrend(trend);
        setState(STATES.GENERATING);
        setIsLoading(true);
        setLoadingMessage(t('craftingBlueprint'));

        try {
            const result = await generate_from_trend(trend, topic, 5, 10, language, dnaOptions);
            if (result && result.scenes) {
                setBlueprint(result);
                setState(STATES.RESULT);
            } else {
                toast.error(t('errorOccurred'));
                setState(STATES.SELECTING);
            }
        } catch (error) {
            console.error('Generation error:', error);
            toast.error(t('errorOccurred') + ': ' + error.message);
            setState(STATES.SELECTING);
        } finally {
            setIsLoading(false);
        }
    };

    // Smart Export: fill multiple Generator fields
    const handleExport = (trend) => {
        // Fill concept with the hook
        updateGeneratorInput('coreIdea', trend.example_hook || trend.title);

        // Fill modifiers with comprehensive style info
        const stylePrompt = `🎯 VIRAL STYLE: ${trend.title}
📈 WHY IT WORKS: ${trend.viral_reason || ''}
🎨 VISUAL: ${trend.visual_style || ''}
${trend.audio_style ? `🔊 AUDIO: ${trend.audio_style}` : ''}
${trend.best_platform ? `📱 BEST FOR: ${trend.best_platform}` : ''}
Apply this viral formula to my video.`;
        updateGeneratorInput('modifiers', stylePrompt);

        // Navigate to Creative Studio
        setActiveTab('generator');
    };

    // Reset to start
    const handleReset = () => {
        setState(STATES.SEARCH);
        setTopic('');
        setTrendOptions([]);
        setSelectedTrend(null);
        setBlueprint(null);
    };

    // Copy blueprint JSON
    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(blueprint, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Get translated trend tags
    const trendTags = t('trendTags') || ['TikTok Trends', 'YouTube Shorts', 'Reels Formulas', 'Viral Hooks'];

    // Platform label helper
    const getPlatformLabel = (id) => {
        const map = {
            general: t('platformGeneral'),
            tiktok: t('platformTikTok'),
            shorts: t('platformShorts'),
            reels: t('platformReels'),
        };
        return map[id] || id;
    };

    // Region label helper
    const getRegionLabel = (id) => {
        const map = {
            global: t('regionGlobal'),
            egypt: t('regionEgypt'),
            saudi: t('regionSaudi'),
            uae: t('regionUAE'),
            usa: t('regionUSA'),
            uk: t('regionUK'),
            morocco: t('regionMorocco'),
        };
        return map[id] || id;
    };

    return (
        <div className="min-h-[calc(100vh-90px)] flex flex-col" dir={textDir}>

            {/* DNA Modal */}
            <DNAModal
                isOpen={showDNAModal}
                onClose={() => setShowDNAModal(false)}
                onGenerate={(dnaOptions) => handleGenerate(pendingTrend, dnaOptions)}
                t={t}
                isRTL={isRTL}
                textDir={textDir}
            />

            {/* ========== STATE: SEARCH (Hero Section) ========== */}
            {state === STATES.SEARCH && (
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    {/* Background Glow Effect */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px]" />
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 text-center max-w-2xl mx-auto" dir={textDir}>
                        {/* Icon */}
                        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-600 to-sky-600 flex items-center justify-center shadow-xl shadow-blue-900/40">
                            <TrendingUp className="w-7 h-7 text-white" />
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                            {t('trendHunterTitle')}
                        </h1>
                        <p className="text-muted text-sm mb-5">
                            {t('trendHunterSubtitle')}
                        </p>

                        {/* Platform Selector */}
                        <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
                            {PLATFORMS.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setPlatform(p.id)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 border ${platform === p.id
                                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-lg shadow-blue-900/20'
                                        : 'bg-white/5 text-muted border-white/5 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <span>{p.icon}</span>
                                    {getPlatformLabel(p.id)}
                                </button>
                            ))}
                        </div>

                        {/* Region Selector */}
                        <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
                            {REGIONS.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => setRegion(r.id)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 border ${region === r.id
                                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-lg shadow-purple-900/20'
                                        : 'bg-white/5 text-muted border-white/5 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <span>{r.icon}</span>
                                    {getRegionLabel(r.id)}
                                </button>
                            ))}
                        </div>

                        {/* Search Box */}
                        <div className="relative max-w-xl mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-sky-600/20 rounded-2xl blur-xl" />
                            <div className="relative bg-bg1/80 backdrop-blur-xl border border-border rounded-2xl p-2 focus-within:border-blue-500/50 transition-all duration-300 focus-within:shadow-lg focus-within:shadow-blue-900/20">
                                <div className="flex items-center gap-3" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                    <div className={isRTL ? 'pr-4 flex items-center gap-1' : 'pl-4 flex items-center gap-1'}>
                                        <Search className="w-5 h-5 text-muted" />
                                        <HelpTooltip text={language === 'ar' ? 'اكتب موضوع أو نيتش لاكتشاف الترندات الحالية' : 'Enter a topic or niche to discover current trends'} />
                                    </div>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder={t('nichedPlaceholder')}
                                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-lg py-3"
                                        style={{ textAlign: isRTL ? 'right' : 'left' }}
                                        dir={textDir}
                                    />
                                    <button
                                        onClick={handleSearch}
                                        disabled={isLoading}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-900/30"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                {t('scanning')}
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4" />
                                                {t('deepScan')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            )}

            {/* ========== STATE: SELECTING (3-Column Grid) ========== */}
            {state === STATES.SELECTING && (
                <div className="flex-1" dir={textDir}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                            <h2 className="text-xl font-bold text-text1 mb-1">
                                🎯 {t('winningFormulas')} "{topic}"
                            </h2>
                            <div className="flex items-center gap-2 mt-1" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                <p className="text-muted text-xs">
                                    {t('selectStyleToGenerate')}
                                </p>
                                {platform !== 'general' && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                        {PLATFORMS.find(p => p.id === platform)?.icon} {getPlatformLabel(platform)}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-3 py-1.5 text-muted hover:text-white bg-bg1/50 hover:bg-bg1 border border-border rounded-lg transition-all text-sm"
                            style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            {t('newSearch')}
                        </button>
                    </div>

                    {/* Empty State */}
                    {trendOptions.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center py-20">
                            <Search className="w-12 h-12 text-muted/30 mb-4" />
                            <h3 className="text-lg font-semibold text-text2 mb-1">{t('noResultsFound')}</h3>
                            <p className="text-muted text-sm">{t('noResultsDesc')}</p>
                            <button
                                onClick={handleReset}
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl transition-all text-sm"
                            >
                                <RotateCcw className="w-4 h-4" />
                                {t('newSearch')}
                            </button>
                        </div>
                    )}

                    {/* 3-Column Grid */}
                    {trendOptions.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {trendOptions.map((trend, index) => (
                                <div
                                    key={trend.id || index}
                                    className="group relative bg-surface backdrop-blur-sm border border-border p-4 rounded-xl hover:border-blue-500/50 hover:scale-[1.02] transition-all duration-300 flex flex-col"
                                    dir={textDir}
                                >
                                    {/* Header: Title + Score + Structure */}
                                    <div className="flex justify-between items-start mb-3" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                        <div className="flex-1" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                                            <h3 className="text-lg font-bold text-text1 group-hover:text-blue-400 transition-colors mb-1">
                                                {trend.title}
                                            </h3>
                                            <div className="flex items-center gap-2 flex-wrap" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                                {(trend.structure_name) && (
                                                    <span className="text-xs text-muted bg-white/5 px-2 py-0.5 rounded-md">
                                                        {trend.structure_name}
                                                    </span>
                                                )}
                                                {(trend.best_platform) && (
                                                    <span className="text-[10px] text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                                                        📱 {trend.best_platform}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                                                {t('viral')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Viral Meter */}
                                    {trend.viral_score && (
                                        <div className="mb-3">
                                            <ViralMeter score={trend.viral_score} />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="space-y-3 mb-4 flex-1">
                                        {/* Why it works */}
                                        <div>
                                            <p className="text-muted text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                                <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                                                {t('whyItWorks')}
                                            </p>
                                            <p className="text-text2 text-sm leading-relaxed" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                                                {trend.viral_reason || trend.psychology || ''}
                                            </p>
                                        </div>

                                        {/* Visual Style */}
                                        <div>
                                            <p className="text-muted text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                                <Eye className="w-3.5 h-3.5 text-blue-400" />
                                                {t('visualStyle')}
                                            </p>
                                            <div className="text-text2 text-xs bg-black/30 p-3 rounded-lg border border-border" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                                                {trend.visual_style || trend.visual_blueprint || ''}
                                            </div>
                                        </div>

                                        {/* Audio Style */}
                                        {(trend.audio_style) && (
                                            <div>
                                                <p className="text-muted text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                                    <Music className="w-3.5 h-3.5 text-purple-400" />
                                                    {t('audioStyle')}
                                                </p>
                                                <div className="text-text2 text-xs bg-black/30 p-3 rounded-lg border border-border" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                                                    {trend.audio_style}
                                                </div>
                                            </div>
                                        )}

                                        {/* Example Hook */}
                                        <div>
                                            <p className="text-muted text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                                                {t('hookExample')}
                                            </p>
                                            <p className={`text-white text-sm italic bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-3 rounded-lg ${isRTL ? 'border-r-2' : 'border-l-2'} border-yellow-500`} style={{ textAlign: isRTL ? 'right' : 'left' }}>
                                                "{trend.example_hook}"
                                            </p>
                                        </div>

                                        {/* Retention Tricks */}
                                        {Array.isArray(trend.retention_tricks) && trend.retention_tricks.length > 0 && (
                                            <div>
                                                <p className="text-muted text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                                                    {t('retentionTricks')}
                                                </p>
                                                <ul className="space-y-1">
                                                    {trend.retention_tricks.map((trick, i) => (
                                                        <li key={i} className="text-text2 text-xs flex items-start gap-1.5" style={{ flexDirection: isRTL ? 'row-reverse' : 'row', textAlign: isRTL ? 'right' : 'left' }}>
                                                            <span className="text-cyan-400 mt-0.5">•</span>
                                                            {trick}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-auto" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                        <button
                                            onClick={() => handleGenerateClick(trend)}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                                            style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            {t('generateBlueprintTrend')}
                                        </button>

                                        <button
                                            onClick={() => handleExport(trend)}
                                            className="px-3 py-2.5 bg-bg1 hover:bg-bg2 text-text2 hover:text-white border border-border rounded-xl transition-all flex items-center gap-2 text-xs"
                                            title={t('exportToStudio')}
                                            style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
                                        >
                                            <Wrench className="w-4 h-4" />
                                            <span className="hidden lg:inline">{t('exportToStudio')}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ========== STATE: GENERATING (Loading Animation) ========== */}
            {state === STATES.GENERATING && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    {/* Background Glow */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
                    </div>

                    <div className="relative z-10 text-center" dir={textDir}>
                        {/* Animated Loader */}
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
                            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
                            <div className="absolute inset-3 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-text1 mb-2">{loadingMessage}</h3>
                        <p className="text-muted">
                            {t('applyingStyle')} <span className="text-blue-400">"{selectedTrend?.title}"</span> {t('styleSuffix')}
                        </p>
                    </div>
                </div>
            )}

            {/* ========== STATE: RESULT (Blueprint Display) ========== */}
            {state === STATES.RESULT && blueprint && (
                <div className="flex-1 flex flex-col" dir={textDir}>
                    {/* Result Header */}
                    <div className="flex items-center justify-between mb-4" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                            <div className="flex items-center gap-2 mb-1" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30 font-medium">
                                    ✓ {t('blueprintReady')}
                                </span>
                                <span className="bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-500/30">
                                    {blueprint.trend_applied}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-text1">{blueprint.title}</h2>
                        </div>
                        <div className="flex gap-2" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                            <button
                                onClick={() => setState(STATES.SELECTING)}
                                className="flex items-center gap-2 px-4 py-2 text-muted hover:text-white bg-bg1/50 hover:bg-bg1 border border-border rounded-lg transition-all"
                                style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
                            >
                                <ArrowRight className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} />
                                {t('back')}
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 px-4 py-2 text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-all"
                                style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
                            >
                                <RotateCcw className="w-4 h-4" />
                                {t('newSearch')}
                            </button>
                        </div>
                    </div>

                    {/* Hook Line */}
                    {blueprint.hook_line && (
                        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-3 mb-4">
                            <p className="text-yellow-400 text-xs font-semibold mb-1">🎣 {t('openingHook')}</p>
                            <p className="text-white text-lg font-medium">"{blueprint.hook_line}"</p>
                        </div>
                    )}

                    {/* Blueprint Content */}
                    <div className={`flex-1 overflow-y-auto space-y-4 ${isRTL ? 'pl-2' : 'pr-2'}`}>
                        {/* Characters */}
                        {blueprint.characters?.length > 0 && (
                            <div className="bg-surface border border-border rounded-xl p-4">
                                <h4 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                    <span className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center text-xs">🎭</span>
                                    {t('charactersSection')}
                                </h4>
                                <div className="space-y-3">
                                    {blueprint.characters.map((char, idx) => (
                                        <div key={idx} className="bg-black/20 rounded-lg p-3 border border-border">
                                            <span className="text-white font-semibold">
                                                {char.name_en} {char.name_ar && <span className="text-muted">({char.name_ar})</span>}
                                            </span>
                                            <p className="text-muted text-sm mt-1">{char.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Scenes */}
                        {blueprint.scenes?.map((scene, idx) => (
                            <div key={idx} className="bg-surface border border-border rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                    <div className="flex items-center gap-3" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                        <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-sm">
                                            {scene.scene_number}
                                        </span>
                                        <span className="text-white font-semibold">{t('scene')} {scene.scene_number}</span>
                                    </div>
                                    <span className="text-muted text-xs bg-black/30 px-2 py-1 rounded">
                                        {scene.duration} • {scene.shot_type}
                                    </span>
                                </div>

                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-green-400 text-xs font-semibold mb-1.5">📽️ {t('visual')}</p>
                                        <p className="text-text2 leading-relaxed" dir="ltr">{scene.visual_script}</p>
                                    </div>
                                    <div>
                                        <p className="text-yellow-400 text-xs font-semibold mb-1.5">💬 {t('dialogue')}</p>
                                        <p className="text-text2 leading-relaxed">{scene.dialogue_script}</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-400 text-xs font-semibold mb-1.5">🔊 {t('audio')}</p>
                                        <p className="text-text2 leading-relaxed">{scene.audio_notes}</p>
                                    </div>
                                    {scene.universal_prompt && (
                                        <div className="bg-black/30 rounded-lg p-3 border border-border">
                                            <p className="text-cyan-400 text-xs font-semibold mb-1.5">🎨 {t('imagePrompt')}</p>
                                            <p className="text-muted text-xs font-mono leading-relaxed" dir="ltr">{scene.universal_prompt}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Copy Button */}
                    <div className="mt-4 pt-3 border-t border-border">
                        <button
                            onClick={handleCopy}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                            style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    {t('copiedToClipboard')}
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5" />
                                    {t('copyFullBlueprint')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrendHunter;
