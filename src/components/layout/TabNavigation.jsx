import React from 'react';

const TabNavigation = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'generator', label: 'Prompt Architect', icon: '🎬' },
        { id: 'extractor', label: 'Prompt Extractor', icon: '🔍' }
    ];

    return (
        <nav className="
      flex items-center justify-center gap-2
      p-2 mb-8
      bg-[#12121a]/80 backdrop-blur-xl
      border border-[#2a2a3e] rounded-2xl
      max-w-md mx-auto
    ">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
            flex-1 px-6 py-3 rounded-xl
            font-semibold text-sm
            transition-all duration-300
            flex items-center justify-center gap-2
            ${activeTab === tab.id
                            ? 'bg-gradient-to-r from-[#00f5ff] to-[#8b5cf6] text-[#0a0a0f] shadow-[0_0_20px_rgba(0,245,255,0.3)]'
                            : 'text-[#8b8b9e] hover:text-white hover:bg-[#1a1a2e]'
                        }
          `}
                >
                    <span>{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default TabNavigation;
