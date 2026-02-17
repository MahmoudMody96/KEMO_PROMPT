import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

// Toast Context
const ToastContext = createContext(null);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};

// Single Toast Item
const ToastItem = ({ toast, onDismiss }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onDismiss(toast.id), 300);
        }, toast.duration || 4000);
        return () => clearTimeout(timer);
    }, [toast, onDismiss]);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => onDismiss(toast.id), 300);
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
        error: <XCircle className="w-5 h-5 text-red-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        info: <Info className="w-5 h-5 text-blue-400" />,
    };

    const borders = {
        success: 'border-emerald-500/30',
        error: 'border-red-500/30',
        warning: 'border-amber-500/30',
        info: 'border-blue-500/30',
    };

    return (
        <div
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl max-w-sm w-full transition-all duration-300 ${borders[toast.type] || borders.info} ${isExiting ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}
            style={{ background: 'rgba(24, 24, 30, 0.95)' }}
            dir="auto"
        >
            <div className="mt-0.5 shrink-0">{icons[toast.type] || icons.info}</div>
            <div className="flex-1 min-w-0">
                {toast.title && (
                    <p className="text-sm font-semibold text-white mb-0.5">{toast.title}</p>
                )}
                <p className="text-sm text-zinc-300 whitespace-pre-line">{toast.message}</p>
            </div>
            <button
                onClick={handleDismiss}
                className="shrink-0 mt-0.5 p-0.5 rounded-md hover:bg-white/10 transition-colors"
            >
                <X className="w-4 h-4 text-zinc-500" />
            </button>
        </div>
    );
};

// Toast Provider
let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
        const id = ++toastIdCounter;
        setToasts(prev => [...prev, { id, type, title, message, duration }]);
        return id;
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Shortcut helpers
    const toast = useCallback({
        success: (message, title) => addToast({ type: 'success', message, title }),
        error: (message, title) => addToast({ type: 'error', message, title, duration: 6000 }),
        warning: (message, title) => addToast({ type: 'warning', message, title, duration: 5000 }),
        info: (message, title) => addToast({ type: 'info', message, title }),
    }, [addToast]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id} className="pointer-events-auto animate-slide-in-right">
                        <ToastItem toast={t} onDismiss={dismissToast} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
