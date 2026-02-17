import React from 'react';
import { useAppContext } from '../../context/AppContext';
import CopyButton from '../ui/CopyButton';
import Spinner from '../ui/Spinner';

const OutputBlock = ({ title, icon, content, colorClass = 'from-[#00f5ff]' }) => {
    if (!content) return null;

    return (
        <div className="output-block fade-in">
            <div className={`
        flex items-center justify-between
        px-5 py-4
        border-b border-[#2a2a3e]
        bg-gradient-to-r ${colorClass} to-transparent/5
      `}>
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <span>{icon}</span>
                    {title}
                </h3>
                <CopyButton text={content} />
            </div>
            <div className="p-5">
                <pre className="
          text-sm text-[#c8c8d8]
          whitespace-pre-wrap
          font-mono
          leading-relaxed
          max-h-[300px] overflow-y-auto
        ">
                    {content}
                </pre>
            </div>
        </div>
    );
};

const GeneratorOutput = () => {
    const { generatedOutput, isGenerating, t, isRTL, language } = useAppContext();

    // SAFETY: Check if critical translations exist
    const safeT = (key, fallback) => t?.(key) || fallback;

    // Empty state
    if (!generatedOutput && !isGenerating) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-center px-8">
                <div className="
          w-24 h-24 mb-6 rounded-full
          bg-gradient-to-br from-[#00f5ff]/20 to-[#ff00ff]/20
          flex items-center justify-center
          pulse-glow
        ">
                    <svg className="w-12 h-12 text-[#00f5ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{safeT('readyToCreate', 'Ready to Create')}</h3>
                <p className="text-[#8b8b9e] max-w-sm" dir={isRTL ? 'rtl' : 'ltr'}>
                    {safeT('fillParams', 'Fill in the parameters and generate your video production guide.')}
                </p>
            </div>
        );
    }

    // Loading state
    if (isGenerating) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-center">
                <Spinner size="xl" className="mb-6" />
                <h3 className="text-xl font-bold gradient-text mb-2">{safeT('generating', 'Generating Blueprint...')}</h3>
                <p className="text-[#8b8b9e]">{safeT('creatingBlueprint', 'Creating your video production guide...')}</p>

                <div className="mt-8 space-y-3 w-full max-w-xs">
                    {[
                        language === 'ar' ? 'تحليل الفكرة الأساسية...' : 'Analyzing core concept...',
                        language === 'ar' ? 'بناء ملامح الشخصيات...' : 'Building character profiles...',
                        language === 'ar' ? 'تصميم تسلسل المشاهد...' : 'Designing scene sequences...'
                    ].map((step, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 text-sm text-[#8b8b9e] slide-in"
                            style={{ animationDelay: `${i * 0.3}s`, flexDirection: isRTL ? 'row-reverse' : 'row' }}
                        >
                            <div className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse"></div>
                            {step}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Output state - with SAFETY CHECKS
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="mb-6" dir={isRTL ? 'rtl' : 'ltr'}>
                <h2 className="text-2xl font-bold gradient-text mb-2">
                    {safeT('blueprintReady', 'Generated Blueprint')}
                </h2>
                <p className="text-[#8b8b9e] text-sm">
                    {language === 'ar' ? 'دليل إنتاج الفيديو جاهز' : 'Your AI video production guide is ready'}
                </p>
            </div>

            {/* Output Blocks - with null-safety */}
            <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                <OutputBlock
                    title={language === 'ar' ? 'ملامح الشخصيات' : 'Character Blueprints'}
                    icon="👤"
                    content={generatedOutput?.characterBlueprints || generatedOutput?.characters}
                    colorClass="from-[#00f5ff]"
                />

                <OutputBlock
                    title={language === 'ar' ? 'توجيهات المشاهد' : 'Scene & Motion Directives'}
                    icon="🎬"
                    content={generatedOutput?.sceneDirectives || generatedOutput?.scenes}
                    colorClass="from-[#8b5cf6]"
                />

                <OutputBlock
                    title={language === 'ar' ? 'برومبتات الصور' : 'Image Generation Prompts'}
                    icon="🖼️"
                    content={generatedOutput?.imagePrompts || generatedOutput?.visualPrompts}
                    colorClass="from-[#ff00ff]"
                />

                {/* Fallback if no blocks rendered */}
                {!generatedOutput?.characterBlueprints &&
                    !generatedOutput?.characters &&
                    !generatedOutput?.sceneDirectives &&
                    !generatedOutput?.scenes &&
                    !generatedOutput?.imagePrompts && (
                        <div className="text-center py-8 text-gray-500">
                            <p>{language === 'ar' ? 'لا توجد بيانات لعرضها' : 'No data available'}</p>
                            <pre className="mt-4 text-xs text-left bg-black/30 p-4 rounded-lg overflow-auto max-h-[300px]">
                                {JSON.stringify(generatedOutput, null, 2)}
                            </pre>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default GeneratorOutput;
