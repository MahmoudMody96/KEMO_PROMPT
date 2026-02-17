import React, { useState } from 'react';

const CopyButton = ({ text, className = '' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`
        px-3 py-2 rounded-lg
        bg-[#1a1a2e] border border-[#2a2a3e]
        text-sm font-medium
        transition-all duration-300
        flex items-center gap-2
        hover:border-[#00f5ff] hover:text-[#00f5ff]
        ${copied ? 'border-[#00ff88] text-[#00ff88]' : 'text-[#8b8b9e]'}
        ${className}
      `}
        >
            {copied ? (
                <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                </>
            )}
        </button>
    );
};

export default CopyButton;
