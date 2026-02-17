import React from 'react';

// Progress Bar Loading State
const GeneratingState = ({ language, progress = 0 }) => {
    const isAr = language === 'ar';
    const stages = isAr
        ? [
            { at: 0, icon: '📊', label: 'تحليل المدخلات...' },
            { at: 15, icon: '⚙️', label: 'بناء البرومبت الاحترافي...' },
            { at: 35, icon: '🧠', label: 'الذكاء الاصطناعي يكتب السيناريو...' },
            { at: 55, icon: '🎬', label: 'معالجة المشاهد والحوارات...' },
            { at: 75, icon: '✨', label: 'اللمسات الأخيرة...' },
            { at: 100, icon: '✅', label: 'تم بنجاح!' },
        ]
        : [
            { at: 0, icon: '📊', label: 'Analyzing inputs...' },
            { at: 15, icon: '⚙️', label: 'Building professional prompt...' },
            { at: 35, icon: '🧠', label: 'AI writing the scenario...' },
            { at: 55, icon: '🎬', label: 'Processing scenes & dialogue...' },
            { at: 75, icon: '✨', label: 'Final touches...' },
            { at: 100, icon: '✅', label: 'Complete!' },
        ];

    const currentStage = [...stages].reverse().find(s => progress >= s.at) || stages[0];

    return (
        <div className="h-full flex flex-col items-center justify-center text-center px-8">
            {/* Animated Icon */}
            <div className="text-5xl mb-5 animate-bounce" style={{ animationDuration: '2s' }}>
                {currentStage.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {isAr ? 'جارِ الإبداع...' : 'Creating Magic...'}
            </h3>

            {/* Current Stage Label */}
            <p className="text-sm text-blue-400 font-medium mb-6 min-h-[20px] transition-all duration-500">
                {currentStage.label}
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-sm mb-4">
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                            width: `${progress}%`,
                            background: progress >= 100
                                ? 'linear-gradient(90deg, #10b981, #34d399)'
                                : 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)',
                        }}
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-xs text-zinc-500">{Math.round(progress)}%</span>
                    <span className="text-xs text-zinc-500">
                        {isAr ? 'يرجى الانتظار...' : 'Please wait...'}
                    </span>
                </div>
            </div>

            {/* Step Indicators */}
            <div className="w-full max-w-sm mt-2">
                <div className="flex justify-between items-center">
                    {stages.slice(0, 5).map((stage, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-500 ${progress >= stage.at
                                    ? 'bg-blue-500/20 text-blue-400 scale-110'
                                    : 'bg-white/5 text-zinc-600 scale-100'
                                    }`}
                            >
                                {stage.icon}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Connecting line */}
                <div className="relative w-full h-0.5 bg-white/5 rounded-full -mt-[18px] mb-4 -z-10">
                    <div
                        className="absolute top-0 left-0 h-full bg-blue-500/30 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default GeneratingState;
