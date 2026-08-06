import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({
    value,
    onChange,
    options = [],
    placeholder = 'Select...',
    icon: Icon,
    className = '',
    style = {},
    disabled = false,
    title = '',           // Optional dropdown title/header
    dropdownWidth,        // Optional override for dropdown width (e.g., 340)
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [rect, setRect] = useState(null);
    const triggerRef = useRef(null);
    const listRef = useRef(null);

    // Calculate position on open
    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const updateRect = () => {
                const r = triggerRef.current.getBoundingClientRect();
                const dw = dropdownWidth || r.width;
                // The menu is position:fixed, so it is placed in viewport
                // coordinates — exactly what getBoundingClientRect returns. The
                // scrollX/scrollY that used to be added here shifted the menu by
                // the scroll offset, and only on one of the two branches, so the
                // two paths disagreed with each other as well.
                let left = r.left;
                if (dw > r.width) {
                    // Centre the wider dropdown over the trigger where possible.
                    left = Math.max(8, r.left - (dw - r.width) / 2);
                    if (left + dw > window.innerWidth - 8) left = window.innerWidth - dw - 8;
                }
                setRect({
                    top: r.bottom + 4,
                    left,
                    width: dw,
                    maxHeight: window.innerHeight - r.bottom - 20
                });
            };
            updateRect();
            window.addEventListener('scroll', updateRect, true);
            window.addEventListener('resize', updateRect);

            // Click outside to close
            const handleClickOutside = (e) => {
                if (triggerRef.current && !triggerRef.current.contains(e.target) &&
                    listRef.current && !listRef.current.contains(e.target)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                window.removeEventListener('scroll', updateRect, true);
                window.removeEventListener('resize', updateRect);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, dropdownWidth]);

    const selectedOption = options.find(o => o.value === value);
    const hasDescriptions = options.some(o => o.description);

    return (
        <>
            <button
                ref={triggerRef}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`relative flex items-center justify-between text-start ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                style={style}
                disabled={disabled}
            >
                <div className="flex items-center gap-2 truncate">
                    {Icon && <Icon className="w-4 h-4 shrink-0 opacity-70" />}
                    <span className="truncate">
                        {selectedOption ? (selectedOption.label || selectedOption.value) : placeholder}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 opacity-50 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && rect && createPortal(
                <div
                    ref={listRef}
                    className="fixed z-[9999] overflow-hidden rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl bg-zinc-900/95 animate-in fade-in zoom-in-95 duration-100"
                    role="listbox"
                    style={{
                        // rect.top is already viewport-relative; the previous
                        // `- window.scrollY` here was compensating for the
                        // scrollY that updateRect wrongly added.
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        maxHeight: Math.min(400, rect.maxHeight || 400),
                    }}
                >
                    {/* Optional Title Header */}
                    {title && (
                        <div className="px-3 py-2 border-b border-white/5 bg-white/[0.02]">
                            <span className="text-[11px] font-semibold text-text2 uppercase tracking-wider">{title}</span>
                        </div>
                    )}

                    <div className="overflow-y-auto custom-scrollbar py-1" style={{ maxHeight: Math.min(360, (rect.maxHeight || 360) - (title ? 36 : 0)) }}>
                        {options.map((opt, idx) => {
                            const isSelected = opt.value === value;
                            return (
                                // A button, not a div: the trigger above was
                                // already keyboard-reachable but the options were
                                // not, so the control could be opened and never
                                // used without a mouse.
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    key={opt.value || idx}
                                    onClick={() => {
                                        onChange({ target: { value: opt.value } });
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-start px-3 py-2.5 cursor-pointer transition-all duration-150 group
                                        ${isSelected
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-text2 hover:bg-white/5 hover:text-white'
                                        }
                                        ${idx < options.length - 1 && hasDescriptions ? 'border-b border-white/[0.03]' : ''}
                                    `}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {opt.icon && <span className="text-base shrink-0">{opt.icon}</span>}
                                            <span className={`text-sm ${opt.description ? 'font-medium' : ''}`}>{opt.label || opt.value}</span>
                                            {opt.badge && (
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${opt.badge === 'advanced' ? 'bg-red-500/15 text-red-400' :
                                                        opt.badge === 'intermediate' ? 'bg-amber-500/15 text-amber-400' :
                                                            'bg-emerald-500/15 text-emerald-400'
                                                    }`}>
                                                    {opt.badge === 'advanced' ? '⚡ Pro' : opt.badge === 'intermediate' ? '📊 Mid' : '✅ Easy'}
                                                </span>
                                            )}
                                        </div>
                                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                                    </div>
                                    {opt.description && (
                                        <p className="text-[11px] text-muted mt-1 leading-relaxed ps-7 group-hover:text-text2 transition-colors">
                                            {opt.description}
                                        </p>
                                    )}
                                </button>
                            );
                        })}
                        {options.length === 0 && (
                            <div className="px-3 py-2 text-sm text-muted text-center">No options</div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default CustomSelect;
