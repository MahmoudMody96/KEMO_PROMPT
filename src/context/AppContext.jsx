import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { translations } from '../i18n/translations';
import { getOptions } from '../i18n/options';

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
    // Language state
    const [language, setLanguage] = useState('en');

    // Navigation — detect URL path for direct access (e.g. /admin)
    const [activeTab, setActiveTab] = useState(() => {
        const path = window.location.pathname.replace('/', '').toLowerCase();
        const validTabs = ['home', 'generator', 'extractor', 'trendhunter', 'promptarchitect', 'secretvault', 'admin', 'pricing', 'about', 'services', 'contact'];
        return validTabs.includes(path) ? path : 'home';
    });

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
    const importFromExtractor = useCallback((extractedData, source = 'image') => {
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
            numCharacters: String(meta.estimated_character_count || prev.numCharacters),
            numScenes: String(meta.estimated_scene_count || prev.numScenes),
        }));

        setActiveTab('generator');
    }, []);

    // Computed helpers
    const isRTL = language === 'ar';
    const textDir = getTextDir(language);
    const textAlign = getTextAlign(language);
    const flexDir = getFlexDir(language);
    const options = useMemo(() => getOptions(language), [language]);

    const value = {
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
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};
