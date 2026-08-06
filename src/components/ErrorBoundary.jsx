import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 p-4">
                    <div className="w-full max-w-2xl rounded-xl border border-red-500/20 bg-zinc-900 p-6 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-red-500/10 rounded-full">
                                <span className="text-2xl">🚨</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-red-500">Application Crashed</h2>
                                <p className="text-sm text-text2">Something went wrong while rendering.</p>
                            </div>
                        </div>

                        {/* The stack trace and component tree are for developers,
                            not end users — in production they leak internal file
                            paths and component names. The full detail always goes
                            to the console via componentDidCatch. */}
                        {import.meta.env.DEV ? (
                            <div className="bg-black/50 rounded-lg p-4 border border-zinc-800 overflow-auto max-h-[60vh] mb-6 font-mono text-sm">
                                <p className="text-red-400 font-semibold mb-2">{this.state.error && this.state.error.toString()}</p>
                                <pre className="text-muted whitespace-pre-wrap text-xs">
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </div>
                        ) : (
                            <div className="bg-black/50 rounded-lg p-4 border border-zinc-800 mb-6 text-sm text-text2">
                                Reloading usually fixes this. If it keeps happening, the details are in your browser console.
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    // Only the app's own volatile keys. localStorage.clear()
                                    // also destroyed the user's saved scenarios, scenario
                                    // history and custom templates with no warning.
                                    ['kemo-last-scenario', 'kemo-scenario-history', 'promptforge_prev_ideas']
                                        .forEach(k => localStorage.removeItem(k));
                                    sessionStorage.clear();
                                    window.location.reload();
                                }}
                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-text2 rounded-lg transition-colors text-sm"
                            >
                                Reset App Data & Reload
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
