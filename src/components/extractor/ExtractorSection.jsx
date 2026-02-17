import React, { useState, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import {
    Video,
    Image,
    Upload,
    Loader2,
    Copy,
    Check,
    Sparkles,
    X,
    FileImage,
    Eye,
    Wand2,
    ArrowRight,
    Film,
    Clock
} from 'lucide-react';
import { analyze_video, analyze_image } from '../../api/promptApi';

// Code Block with Smart Import Button
const CodeBlock = ({ title, content, icon: Icon, onUseInArchitect, showImport = false }) => {
    const [copied, setCopied] = useState(false);
    const { t } = useAppContext();

    const handleCopy = async () => {
        const textContent = typeof content === 'object' ? JSON.stringify(content, null, 2) : content;
        await navigator.clipboard.writeText(textContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!content) return null;

    const displayContent = typeof content === 'object'
        ? JSON.stringify(content, null, 2)
        : content;

    return (
        <div className="code-block fade-in">
            <div className="code-block-header">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-text2" />}
                    <span className="text-sm font-medium text-white">{title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleCopy} className="btn btn-secondary text-xs">
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? '✓' : 'Copy'}</span>
                    </button>
                    {showImport && onUseInArchitect && (
                        <button onClick={onUseInArchitect} className="btn btn-primary text-xs">
                            <Wand2 className="w-3 h-3" />
                            <span className="hidden sm:inline">{t('useInArchitect')}</span>
                            <ArrowRight className="w-3 h-3 sm:hidden" />
                        </button>
                    )}
                </div>
            </div>
            <pre className="code-block-content text-left" dir="ltr">
                {displayContent}
            </pre>
        </div>
    );
};

// Image Analyzer - LEFT COLUMN
const ImageAnalyzer = () => {
    const {
        selectedImage,
        setSelectedImage,
        imagePrompt,
        setImagePrompt,
        isExtractingImage,
        setIsExtractingImage,
        importFromExtractor,
        t,
        isRTL
    } = useAppContext();
    const toast = useToast();

    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [rawResult, setRawResult] = useState(null);

    const handleFileSelect = useCallback((file) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    }, [setSelectedImage]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    }, [handleFileSelect]);

    const handleRemove = () => {
        setSelectedImage(null);
        setPreview(null);
        setImagePrompt(null);
        setRawResult(null);
    };

    const handleExtract = async () => {
        if (!selectedImage) {
            toast.warning(t('uploadImageFirst'));
            return;
        }

        setIsExtractingImage(true);
        try {
            const result = await analyze_image(selectedImage);
            setRawResult(result);
            if (result && result.universal_prompt) {
                const ve = result.visual_elements || {};
                const formattedOutput = `## 🔬 Forensic Analysis

**Subject:** ${ve.subject || 'N/A'}
**Style/Engine:** ${ve.style || 'N/A'}
**Lighting:** ${ve.lighting || 'N/A'}
**Camera/Lens:** ${ve.camera || 'N/A'}
**Colors:** ${ve.colors || 'N/A'}
**Composition:** ${ve.composition || 'N/A'}

---

## 🎯 Universal Prompt

${result.universal_prompt}`;
                setImagePrompt(formattedOutput);
            } else if (result) {
                setImagePrompt(JSON.stringify(result, null, 2));
            }
        } catch (error) {
            console.error('Image extraction error:', error);
        } finally {
            setIsExtractingImage(false);
        }
    };

    const handleUseInArchitect = () => {
        if (rawResult) {
            importFromExtractor(rawResult, 'image');
        }
    };

    return (
        <div className="card h-full flex flex-col">
            <div className={`card-header ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Image className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm text-white">{t('imageToPrompt')}</h3>
                        <p className="text-[11px] text-muted">{t('imageToPromptDesc')}</p>
                    </div>
                </div>
            </div>

            <div className="card-body flex-1 flex flex-col space-y-3">
                {!preview ? (
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`
              border-2 border-dashed rounded-xl p-8
              flex flex-col items-center justify-center
              transition-all cursor-pointer min-h-[200px]
              ${isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-border hover:border-zinc-600 bg-bg1/30'}
            `}
                        onClick={() => document.getElementById('image-input').click()}
                    >
                        <Upload className={`w-10 h-10 mb-3 ${isDragging ? 'text-blue-400' : 'text-muted'}`} />
                        <p className="text-sm font-medium text-text2 mb-1">{t('dragDropImage')}</p>
                        <p className="text-xs text-zinc-600">{t('browseImageFormats')}</p>
                        <input
                            id="image-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="relative group">
                        <img src={preview} alt="Preview" className="w-full h-44 object-cover rounded-xl" />
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-2 rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 px-3 py-1 rounded-lg bg-black/70 text-xs text-white flex items-center gap-2">
                            <FileImage className="w-3 h-3" />
                            {selectedImage.name.slice(0, 20)}...
                        </div>
                    </div>
                )}

                <button
                    onClick={handleExtract}
                    disabled={isExtractingImage || !selectedImage}
                    className={`w-full btn btn-primary ${!selectedImage ? 'opacity-50' : ''}`}
                >
                    {isExtractingImage ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /><span>{t('extractingPrompt')}</span></>
                    ) : (
                        <><Sparkles className="w-4 h-4" /><span>{t('extractPrompt')}</span></>
                    )}
                </button>

                {isExtractingImage && (
                    <div className="p-6 rounded-lg bg-bg1/50 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-2" />
                        <p className="text-sm text-text2">{t('analyzingVisual')}</p>
                    </div>
                )}

                {imagePrompt && (
                    <div className="flex-1 overflow-auto">
                        <CodeBlock
                            title={t('visualAnalysis')}
                            content={imagePrompt}
                            icon={Eye}
                            showImport={true}
                            onUseInArchitect={handleUseInArchitect}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

// Video Analyzer with VERTICAL STACK Layout - RIGHT COLUMN
const VideoAnalyzer = () => {
    const {
        videoAnalysis,
        setVideoAnalysis,
        isAnalyzingVideo,
        setIsAnalyzingVideo,
        importFromExtractor,
        t,
        isRTL
    } = useAppContext();

    const [selectedVideo, setSelectedVideo] = useState(null);
    const [progress, setProgress] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = useCallback((file) => {
        if (file && file.type.startsWith('video/')) {
            setSelectedVideo(file);
            setVideoAnalysis(null);
        }
    }, [setVideoAnalysis]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    }, [handleFileSelect]);

    const handleRemoveVideo = () => {
        setSelectedVideo(null);
        setVideoAnalysis(null);
        setProgress('');
    };

    const handleAnalyzeFile = async () => {
        if (!selectedVideo) return;

        setIsAnalyzingVideo(true);
        setProgress('Starting analysis...');

        try {
            const result = await analyze_video(selectedVideo, (msg) => setProgress(msg));

            if (result) {
                if (result.error) {
                    setVideoAnalysis(result.message);
                } else {
                    const formatted = `## Visual Style
${result.visual_style || 'N/A'}

## Motion & Pacing
${result.motion_description || 'N/A'}

## Scene Progression
${result.scene_progression || 'N/A'}

---

## Universal Prompt
${result.universal_prompt || 'N/A'}`;
                    setVideoAnalysis(formatted);
                }
            }
        } catch (error) {
            console.error('Video analysis error:', error);
            setVideoAnalysis(`Error: ${error.message}`);
        } finally {
            setIsAnalyzingVideo(false);
            setProgress('');
        }
    };


    const handleUseInArchitect = () => {
        if (videoAnalysis) {
            importFromExtractor(videoAnalysis, 'video');
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="card h-full flex flex-col">
            {/* Header */}
            <div className={`card-header ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Video className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm text-white">{t('videoToPrompt')}</h3>
                        <p className="text-[11px] text-muted">{t('videoToPromptDesc')}</p>
                    </div>
                </div>
            </div>

            {/* Body - VERTICAL STACK */}
            <div className="card-body flex-1 flex flex-col gap-3">

                {/* ELEMENT A: Large File Dropzone (Top) */}
                {!selectedVideo ? (
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`
              border-2 border-dashed rounded-xl
              flex flex-col items-center justify-center
              transition-all cursor-pointer min-h-[200px]
              ${isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-border hover:border-zinc-600 bg-bg1'}
            `}
                        onClick={() => document.getElementById('video-input').click()}
                    >
                        <Film className={`w-12 h-12 mb-4 ${isDragging ? 'text-blue-400' : 'text-muted'}`} />
                        <p className="text-sm font-medium text-text1 mb-1">{t('dragDropVideo')}</p>
                        <p className="text-xs text-muted">{t('browseVideoFormats')}</p>
                        <input
                            id="video-input"
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="rounded-xl bg-bg1 border border-border p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <Film className="w-7 h-7 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{selectedVideo.name}</p>
                                <p className="text-xs text-muted">{formatFileSize(selectedVideo.size)}</p>
                            </div>
                            <button
                                onClick={handleRemoveVideo}
                                disabled={isAnalyzingVideo}
                                className="p-2 rounded-lg hover:bg-zinc-600 text-text2 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Analyze Video Button — always visible */}
                <button
                    onClick={handleAnalyzeFile}
                    disabled={isAnalyzingVideo || !selectedVideo}
                    className={`w-full btn btn-primary ${!selectedVideo ? 'opacity-50' : ''}`}
                >
                    {isAnalyzingVideo ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /><span>{t('analyzing')}</span></>
                    ) : (
                        <><Sparkles className="w-4 h-4" /><span>{t('analyzeVideo')}</span></>
                    )}
                </button>

                {/* Info Badge */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-xs text-blue-300">{t('videoFrameInfo')}</span>
                </div>


                {/* Progress Indicator */}
                {isAnalyzingVideo && progress && (
                    <div className="p-4 rounded-lg bg-bg1/50 flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />
                        <p className="text-sm text-text2">{progress}</p>
                    </div>
                )}

                {/* Result - Below Stack */}
                {videoAnalysis && (
                    <div className="flex-1 overflow-auto">
                        <CodeBlock
                            title={t('universalPrompt')}
                            content={videoAnalysis}
                            icon={Eye}
                            showImport={true}
                            onUseInArchitect={handleUseInArchitect}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

// Main Section - 2-Column Grid Layout
const ExtractorSection = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: 'calc(100vh - 140px)' }}>
            <ImageAnalyzer />
            <VideoAnalyzer />
        </div>
    );
};

export default ExtractorSection;
