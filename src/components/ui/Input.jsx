import React from 'react';

const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    min,
    max,
    className = '',
    required = false
}) => {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-[#8b8b9e]">
                    {label}
                    {required && <span className="text-[#ff00ff] ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                min={min}
                max={max}
                className={`
          w-full px-4 py-3 rounded-xl
          bg-[#1a1a2e] border border-[#2a2a3e]
          text-white placeholder-[#5a5a6e]
          input-focus
          transition-all duration-300
          hover:border-[#3a3a4e]
        `}
            />
        </div>
    );
};

export default Input;
