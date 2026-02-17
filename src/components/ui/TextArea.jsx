import React from 'react';

const TextArea = ({
    label,
    value,
    onChange,
    placeholder = '',
    rows = 4,
    className = '',
    required = false,
    maxLength
}) => {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-[#8b8b9e]">
                        {label}
                        {required && <span className="text-[#ff00ff] ml-1">*</span>}
                    </label>
                    {maxLength && (
                        <span className="text-xs text-[#5a5a6e]">
                            {value.length}/{maxLength}
                        </span>
                    )}
                </div>
            )}
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
                className={`
          w-full px-4 py-3 rounded-xl
          bg-[#1a1a2e] border border-[#2a2a3e]
          text-white placeholder-[#5a5a6e]
          input-focus resize-none
          transition-all duration-300
          hover:border-[#3a3a4e]
        `}
            />
        </div>
    );
};

export default TextArea;
