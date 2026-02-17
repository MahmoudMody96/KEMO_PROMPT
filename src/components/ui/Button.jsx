import React from 'react';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
    loading = false,
    className = '',
    type = 'button'
}) => {
    const baseStyles = `
    relative px-6 py-3 rounded-xl font-semibold text-sm
    transition-all duration-300 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
    btn-glow overflow-hidden
  `;

    const variants = {
        primary: `
      bg-gradient-to-r from-[#00f5ff] to-[#8b5cf6]
      text-[#0a0a0f] hover:shadow-[0_0_30px_rgba(0,245,255,0.5)]
    `,
        secondary: `
      bg-transparent border-2 border-[#00f5ff]
      text-[#00f5ff] hover:bg-[#00f5ff]/10
    `,
        danger: `
      bg-gradient-to-r from-[#ff4444] to-[#ff00ff]
      text-white hover:shadow-[0_0_30px_rgba(255,68,68,0.5)]
    `
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {loading && (
                <svg className="w-5 h-5 spinner" viewBox="0 0 24 24" fill="none">
                    <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;
