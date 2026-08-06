import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { translations } from '../i18n/translations';
import { getOptions } from '../i18n/options';
import { VALID_TABS, tabFromPath, isKnownPath, pathForTab } from '../lib/routes';

// Re-export for backward compatibility if needed externally
export { translations, getOptions };

// ============================================
// LAYOUT HELPERS
// ============================================
/**
 * Get text direction for content (RTL for Arabic, LTR for English)
 * Note: Layout always stays LTR, only text content direction changes
 */
export const getTextDir = (lang) => (lang === 'ar' ? 'rtl' : 'ltr');

/**
 * Get text alignment based on language
 */
export const getTextAlign = (lang) => (lang === 'ar' ? 'right' : 'left');

/**
 * Get flex direction for RTL-aware row layouts
 */
export const getFlexDir = (lang) => (lang === 'ar' ? 'row-reverse' : 'row');

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    // Language state — persisted, like the theme. It used to reset to 'en' on
    // every reload, so an Arabic-preferring user re-picked their language each
    // time they opened the app.
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('kemo-language');
        return saved === 'ar' || saved === 'en' ? saved : 'en';
    });

    // Reflect the language on <html> so the browser applies real bidi handling.
    //
    // getTextDir existed but nothing ever set document.dir, so RTL was faked with
    // per-element flex-row-reverse classes: Arabic text got no proper caret
    // behaviour, punctuation placement or logical scroll direction in inputs.
    useEffect(() => {
        localStorage.setItem('kemo-language', language);
        document.documentElement.setAttribute('lang', language);
        document.documentElement.setAttribute('dir', getTextDir(language));
    }, [language]);

    // Theme.
    //
    // Lifted out of Sidebar: that component only mounts once you are signed in,
    // so the public landing page and the login screen had no way to read or
    // change the theme. main.jsx applies the stored value before first paint;
    // this owns it from then on.
    const [theme, setTheme] = useState(() => localStorage.getItem('kemo-theme') || 'dark');

    useEffect(() => {
        const root = document.documentElement;
        // Suppress transitions across the swap — see THEME SWITCH in index.css.
        // Without this, colour-transitioning nodes keep the previous theme's
        // resolved colour because the var() behind them changed rather than the
        // declaration itself.
        root.classList.add('theme-switching');
        root.setAttribute('data-theme', theme);
        localStorage.setItem('kemo-theme', theme);

        const id = requestAnimationFrame(() => {
            requestAnimationFrame(() => root.classList.remove('theme-switching'));
        });
        return () => cancelAnimationFrame(id);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    // Navigation.
    //
    // Routing is hand-rolled (there is no react-router dependency). It used to
    // read the path exactly once at startup and never touch history again, so
    // the address bar always said "/" no matter where you were: nothing was
    // shareable or bookmarkable, and Back left the site entirely — discarding
    // whatever was half-typed into the generator.
    //
    // `navigate` below pushes a real history entry, and the popstate listener
    // maps it back, so Back and Forward walk the tabs as users expect.
    const [activeTab, setActiveTabState] = useState(() => tabFromPath(window.location.pathname));

    // A path that matches no tab is now distinguishable from the homepage.
    const [notFound, setNotFound] = useState(
        () => !isKnownPath(window.location.pathname)
    );

    const navigate = useCallback((tab, { replace = false } = {}) => {
        const target = VALID_TABS.includes(tab) ? tab : 'home';
        const url = pathForTab(target);
        if (window.location.pathname !== url) {
            window.history[replace ? 'replaceState' : 'pushState']({ tab: target }, '', url);
        }
        setNotFound(false);
        setActiveTabState(target);
    }, []);

    useEffect(() => {
        const onPopState = () => {
            setActiveTabState(tabFromPath(window.location.pathname));
            setNotFound(!isKnownPath(window.location.pathname));
        };
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    // Callers still say setActiveTab(...) everywhere; route it through navigate
    // so every one of them updates the URL too.
    const setActiveTab = navigate;

    // Generator state
    const [generatorInputs, setGeneratorInputs] = useState({
        coreIdea: '',
        numScenes: '5',
        videoStyle: '',
        genre: '',
        characters: {
            primary: '',
            secondary: [],
        },
        duration: '',
        modifiers: '',
        prohibitions: '',
        voiceTone: 'Professional',
        videoLanguage: 'Egyptian Arabic (Masri)',
        aspectRatio: '16:9',
    });

    const [generatedOutput, setGeneratedOutput] = useState(() => {
        try {
            const saved = localStorage.getItem('kemo-last-scenario');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);

    // Persist generated output to localStorage
    useEffect(() => {
        try {
            if (generatedOutput) {
                localStorage.setItem('kemo-last-scenario', JSON.stringify(generatedOutput));
            }
        } catch { /* quota exceeded — silently fail */ }
    }, [generatedOutput]);

    // Extractor state
    const [videoUrl, setVideoUrl] = useState('');
    const [videoAnalysis, setVideoAnalysis] = useState(null);
    const [isAnalyzingVideo, setIsAnalyzingVideo] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePrompt, setImagePrompt] = useState(null);
    const [isExtractingImage, setIsExtractingImage] = useState(false);

    // Helpers
    const updateGeneratorInput = useCallback((field, value) => {
        setGeneratorInputs(prev => ({ ...prev, [field]: value }));
    }, []);

    // Multi-character helpers
    const updateCharacter = useCallback((role, index, value) => {
        setGeneratorInputs(prev => {
            const chars = { ...prev.characters };
            if (role === 'primary') {
                chars.primary = value;
            } else if (role === 'add') {
                chars.secondary = [...(chars.secondary || []), ''];
            } else if (role === 'remove') {
                chars.secondary = (chars.secondary || []).filter((_, i) => i !== index);
            } else if (role === 'secondary') {
                const updated = [...(chars.secondary || [])];
                updated[index] = value;
                chars.secondary = updated;
            }
            return { ...prev, characters: chars };
        });
    }, []);

    // Translation function - gets text from dictionary
    const t = useCallback((key) => {
        return translations[language]?.[key] || translations.en?.[key] || key;
    }, [language]);

    const toggleLanguage = useCallback(() => {
        setLanguage(prev => prev === 'en' ? 'ar' : 'en');
    }, []);

    // Smart Import: Bridge Extractor -> Generator with AUTO-FILL
    const importFromExtractor = useCallback((extractedData, _source = 'image') => {
        const meta = extractedData?.meta_data || {};

        let coreIdea = '';
        let modifiersText = '';

        if (typeof extractedData === 'string') {
            coreIdea = extractedData.substring(0, 500);
            modifiersText = 'Imported from analysis';
        } else {
            coreIdea = extractedData.visual_style ||
                extractedData.visual_elements?.subject ||
                extractedData.universal_prompt?.substring(0, 300) ||
                'Imported visual concept';
            modifiersText = extractedData.universal_prompt || '';
        }

        setGeneratorInputs(prev => ({
            ...prev,
            coreIdea: coreIdea,
            modifiers: modifiersText,
            videoStyle: meta.recommended_style || prev.videoStyle,
            genre: meta.recommended_genre || prev.genre,
            aspectRatio: meta.detected_aspect_ratio || prev.aspectRatio,
            // `numCharacters` is not part of generatorInputs, so prev.numCharacters
            // was undefined and this wrote the literal string "undefined" whenever
            // the model omitted a count. Nothing reads the field — screenplayEngine
            // derives its character count from inputs.characters — so only keep a
            // value the model actually supplied.
            ...(meta.estimated_character_count
                ? { numCharacters: String(meta.estimated_character_count) }
                : {}),
            numScenes: String(meta.estimated_scene_count || prev.numScenes),
        }));

        setActiveTab('generator');
    }, [setActiveTab]);

    // Computed helpers
    const isRTL = language === 'ar';
    const textDir = getTextDir(language);
    const textAlign = getTextAlign(language);
    const flexDir = getFlexDir(language);
    const options = useMemo(() => getOptions(language), [language]);

    // Memoised: this object used to be rebuilt on every render, giving the
    // provider value a fresh identity each time. Because generatorInputs lives
    // here, that meant every keystroke in the generator form re-rendered every
    // consumer — Sidebar, Header, CommandPalette and the whole active tab.
    //
    // The setters are stable (useState/useCallback) so they are omitted from the
    // dependency list only where React guarantees their identity.
    const value = useMemo(() => ({
        // Language & i18n
        language,
        setLanguage,
        toggleLanguage,
        t,
        isRTL,
        textDir,
        textAlign,
        flexDir,
        options,

        // Navigation
        activeTab,
        setActiveTab,
        navigate,
        notFound,

        // Theme
        theme,
        toggleTheme,

        // Generator
        generatorInputs,
        updateGeneratorInput,
        updateCharacter,
        generatedOutput,
        setGeneratedOutput,
        isGenerating,
        setIsGenerating,
        generationProgress,
        setGenerationProgress,

        // Extractor
        videoUrl,
        setVideoUrl,
        videoAnalysis,
        setVideoAnalysis,
        isAnalyzingVideo,
        setIsAnalyzingVideo,
        selectedImage,
        setSelectedImage,
        imagePrompt,
        setImagePrompt,
        isExtractingImage,
        setIsExtractingImage,

        // Smart Import
        importFromExtractor,
    }), [
        language, setLanguage, toggleLanguage, t, isRTL, textDir, textAlign, flexDir, options,
        activeTab, setActiveTab, navigate, notFound,
        theme, toggleTheme,
        generatorInputs, updateGeneratorInput, updateCharacter,
        generatedOutput, isGenerating, generationProgress,
        videoUrl, videoAnalysis, isAnalyzingVideo,
        selectedImage, imagePrompt, isExtractingImage,
        importFromExtractor,
    ]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};
