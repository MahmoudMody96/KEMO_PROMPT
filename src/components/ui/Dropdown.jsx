import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({
    label,
    options,
    value,
    onChange,
    className = '',
    required = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`flex flex-col gap-2 ${className}`} ref={dropdownRef}>
            {label && (
                <label className="text-sm font-medium text-[#8b8b9e]">
                    {label}
                    {required && <span className="text-[#ff00ff] ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
            w-full px-4 py-3 rounded-xl
            bg-[#1a1a2e] border border-[#2a2a3e]
            text-white text-left
            transition-all duration-300
            hover:border-[#3a3a4e]
            flex items-center justify-between
            ${isOpen ? 'border-[#00f5ff] shadow-[0_0_20px_rgba(0,245,255,0.2)]' : ''}
          `}
                >
                    <span>{selectedOption?.label || 'Select...'}</span>
                    <svg
                        className={`w-5 h-5 text-[#8b8b9e] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="
            absolute z-50 w-full mt-2
            bg-[#12121a] border border-[#2a2a3e]
            rounded-xl overflow-hidden
            shadow-[0_10px_40px_rgba(0,0,0,0.5)]
            fade-in
          ">
                        {options.map((option, idx) => (
                            option.group ? (
                                <div
                                    key={`group-${idx}`}
                                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#8b8b9e] border-t border-[#2a2a3e] mt-1 pt-2 select-none"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    {option.label}
                                </div>
                            ) : (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`
                  w-full px-4 py-3 text-left
                  transition-all duration-200
                  hover:bg-[#1a1a2e] hover:text-[#00f5ff]
                  ${value === option.value ? 'bg-[#1a1a2e] text-[#00f5ff]' : 'text-white'}
                `}
                                >
                                    {option.label}
                                </button>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dropdown;
