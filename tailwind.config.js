/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: ['selector', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                bg0: "var(--bg-app)",
                bg1: "var(--bg-sidebar)",
                bg2: "var(--bg-hover)",
                surface: "var(--bg-surface)",
                border: "var(--border-color)",
                primary: "#6C5CFF",
                primary2: "#4DA3FF",
                text1: "var(--text-primary)",
                text2: "var(--text-secondary)",
                text3: "var(--text-muted)",
                muted: "var(--text-muted)",
                "hover-state": "var(--bg-hover)",
                "active-state": "var(--bg-active)",
                // Extended palette for legacy support or accents
                rose: {
                    500: '#f43f5e',
                    900: '#881337',
                },
                emerald: {
                    500: '#10b981',
                    900: '#064e3b',
                },
                indigo: {
                    500: '#6366f1',
                    900: '#312e81',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Alexandria', 'Cairo', 'sans-serif'],
            },
            borderRadius: {
                sm: "8px",
                md: "10px",
                lg: "14px",
                xl: "18px"
            },
            boxShadow: {
                card: "var(--shadow-card)",
                glow: "var(--shadow-glow)",
                glowSm: "0 4px 12px rgba(108,92,255,0.25)"
            },
            backgroundImage: {
                "primary-gradient": "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)",
                "surface-gradient": "linear-gradient(180deg, var(--bg-surface) 0%, transparent 100%)",
                "radial-highlight": "radial-gradient(circle, rgba(108,92,255,0.08), transparent 60%)"
            }
        }
    },
    plugins: [],
}
