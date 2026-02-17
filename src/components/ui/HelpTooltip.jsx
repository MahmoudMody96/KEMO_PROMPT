import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

const HelpTooltip = ({ text, size = 14 }) => {
    const [show, setShow] = useState(false);
    const [position, setPosition] = useState('top');
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);

    useEffect(() => {
        if (show && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // If too close to top, show below
            if (rect.top < 80) {
                setPosition('bottom');
            } else {
                setPosition('top');
            }
        }
    }, [show]);

    if (!text) return null;

    return (
        <span className="relative inline-flex items-center">
            <button
                ref={triggerRef}
                type="button"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onFocus={() => setShow(true)}
                onBlur={() => setShow(false)}
                className="inline-flex items-center justify-center rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-white/10 transition-all duration-200 cursor-help outline-none focus:ring-1 focus:ring-white/20"
                style={{ width: size, height: size }}
                tabIndex={-1}
                aria-label="Help"
            >
                <HelpCircle style={{ width: size - 2, height: size - 2 }} />
            </button>

            {show && (
                <span
                    ref={tooltipRef}
                    className={`
                        absolute z-[9999] px-3 py-2 text-[11px] leading-relaxed
                        rounded-lg border border-white/10
                        bg-zinc-900/95 backdrop-blur-xl text-zinc-200
                        shadow-xl shadow-black/40
                        whitespace-normal max-w-[220px] min-w-[120px]
                        pointer-events-none select-none
                        animate-in fade-in zoom-in-95 duration-150
                        ${position === 'top'
                            ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
                            : 'top-full mt-2 left-1/2 -translate-x-1/2'
                        }
                    `}
                >
                    {text}
                    {/* Arrow */}
                    <span
                        className={`
                            absolute left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 
                            bg-zinc-900/95 border-white/10
                            ${position === 'top'
                                ? 'top-full -mt-1 border-r border-b'
                                : 'bottom-full -mb-1 border-l border-t'
                            }
                        `}
                    />
                </span>
            )}
        </span>
    );
};

export default HelpTooltip;
