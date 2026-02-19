import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Wand2 } from 'lucide-react';
import GeneratorForm from './GeneratorForm';
import ResultsPanel from './ResultsPanel';

// Main Section — thin wrapper composing the two panels
const GeneratorSection = () => {
    const { language } = useAppContext();
    const isRTL = language === 'ar';

    return (
        <div className="flex flex-col md:flex-row gap-4 min-h-[60vh] md:h-[calc(100vh-80px)]" dir="ltr">
            {/* Form Panel — shows first on mobile */}
            <div
                className="rounded-2xl flex flex-col overflow-hidden relative z-10 w-full md:w-1/2 order-1 md:order-2"
                style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    backdropFilter: 'blur(12px)',
                }}
            >
                {/* Hero Header */}
                <div className="px-4 md:px-5 py-3 md:py-4 border-b border-white/[0.04]" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(59,130,246,0.04), transparent)' }}>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.15))', boxShadow: '0 0 25px rgba(139,92,246,0.1)' }}>
                            <Wand2 className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-sm md:text-base font-bold text-text1">{isRTL ? 'استوديو الإبداع' : 'Creative Studio'}</h2>
                            <p className="text-[11px] text-zinc-500">{isRTL ? 'صمّم سيناريو فيديو احترافي بالذكاء الاصطناعي' : 'Design professional video blueprints with AI'}</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 md:p-4 custom-scrollbar">
                    <GeneratorForm />
                </div>
            </div>

            {/* Results Panel — shows below form on mobile */}
            <div
                className="rounded-2xl flex flex-col overflow-hidden relative w-full md:w-1/2 order-2 md:order-1"
                style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    backdropFilter: 'blur(12px)',
                }}
            >
                <div className="absolute inset-0 bg-radial-highlight pointer-events-none opacity-20" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
                <div className="flex-1 overflow-y-auto p-3 md:p-3.5 custom-scrollbar relative z-10">
                    <ResultsPanel />
                </div>
            </div>
        </div>
    );
};

export default GeneratorSection;
