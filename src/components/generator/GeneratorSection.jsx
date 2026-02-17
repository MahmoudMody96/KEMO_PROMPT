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
        <div className="flex gap-4 h-[calc(100vh-80px)]" dir="ltr">
            {/* Left Panel - Results (50%) */}
            <div
                className="rounded-2xl flex flex-col overflow-hidden relative"
                style={{
                    width: '50%',
                    flexShrink: 0,
                    background: 'rgba(15,15,25,0.6)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(12px)',
                }}
            >
                <div className="absolute inset-0 bg-radial-highlight pointer-events-none opacity-20" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
                <div className="flex-1 overflow-y-auto p-3.5 custom-scrollbar relative z-10">
                    <ResultsPanel />
                </div>
            </div>

            {/* Right Panel - Form (50%) */}
            <div
                className="rounded-2xl flex flex-col overflow-hidden relative z-10"
                style={{
                    width: '50%',
                    flexShrink: 0,
                    background: 'rgba(15,15,25,0.5)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(12px)',
                }}
            >
                {/* Hero Header */}
                <div className="px-5 py-4 border-b border-white/[0.04]" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(59,130,246,0.04), transparent)' }}>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.15))', boxShadow: '0 0 25px rgba(139,92,246,0.1)' }}>
                            <Wand2 className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white">{isRTL ? 'استوديو الإبداع' : 'Creative Studio'}</h2>
                            <p className="text-[11px] text-zinc-500">{isRTL ? 'صمّم سيناريو فيديو احترافي بالذكاء الاصطناعي' : 'Design professional video blueprints with AI'}</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <GeneratorForm />
                </div>
            </div>
        </div>
    );
};

export default GeneratorSection;
