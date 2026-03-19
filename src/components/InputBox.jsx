import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InputBox({ onAnalyze, isLoading }) {
    const [input, setInput] = useState('');

    const sampleTexts = [
        "TypeError: Cannot read property 'map' of undefined",
        "ReferenceError: process is not defined",
        "useEffect is causing an infinite loop"
    ];

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) {
            toast.error("Please paste some code first", {
                style: {
                    background: '#333',
                    color: '#fff',
                },
            });
            return;
        }
        if (!isLoading) {
            toast.loading("Analyzing your code...", { id: "analyze" });
            onAnalyze(input);
            // Assuming onAnalyze resolves eventually, we might need to dismiss toast in App.jsx
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                handleSubmit(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [input, isLoading]);

    const handleClear = () => {
        setInput('');
        toast.success('Cleared text', {
            style: { background: '#333', color: '#fff' }
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto mt-6"
        >
            <div className="text-center mb-12 flex flex-col items-center">
                <div className="bg-brand-light dark:bg-[#1f2428] text-brand-pink dark:text-[#c9d1d9] text-xs font-bold tracking-widest px-6 py-2 rounded-full mb-8 inline-flex items-center gap-2 border border-brand-pink/20 dark:border-[#30363d] uppercase transition-colors">
                    <Sparkles size={14} className="dark:text-[#e3b341]" />
                    High-Performance Code Analysis
                </div>

                <h1 className="text-5xl sm:text-7xl font-display font-extrabold text-slate-900 dark:text-[#c9d1d9] mb-6 leading-tight tracking-tight transition-colors">
                    See your code <br />
                    through <span className="text-brand-pink dark:text-[#58a6ff] italic">different minds</span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-500 dark:text-[#8b949e] max-w-xl mx-auto font-medium transition-colors">
                    Analyze your code through multiple professional lenses. From technical root causes to architectural reviews, get the insights you need.
                </p>
            </div>

            <div className="bg-white dark:bg-[#0d1117] p-2 sm:p-4 rounded-[2rem] shadow-xl dark:shadow-none shadow-brand-pink/5 border border-slate-100 dark:border-[#30363d] relative transition-colors">
                <form onSubmit={handleSubmit} className="flex flex-col">
                    {/* MacOS Window Header */}
                    <div className="bg-white dark:bg-[#161b22] rounded-t-[1.5rem] px-6 py-4 flex items-center justify-center relative border-b border-slate-50 dark:border-[#30363d] transition-colors">
                        <div className="absolute left-6 flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                        </div>
                        <span className="text-xs font-mono text-slate-400 dark:text-[#8b949e] font-medium">Review.js</span>
                    </div>

                    <div className="px-2 pb-2 relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            placeholder="Paste your code or error here..."
                            className="w-full h-64 bg-brand-light/50 text-slate-700 p-6 rounded-2xl focus:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-pink/20 resize-none transition-all placeholder:text-slate-400 font-mono text-sm sm:text-base dark:bg-[#0d1117] dark:text-[#c9d1d9] dark:border dark:border-[#30363d]"
                        />
                        {input.length > 0 && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="absolute top-4 right-6 text-slate-400 hover:text-slate-600 bg-white/80 dark:bg-[#161b22]/80 dark:hover:text-[#c9d1d9] rounded-full p-1 shadow-sm"
                            >
                                <X size={16} />
                            </button>
                        )}
                        <div className="flex justify-between items-center mt-2 px-2">
                            <span className="text-xs font-medium text-slate-400 dark:text-[#8b949e]">Pro tip: Press Ctrl+Enter to analyze</span>
                            <span className={`text-xs font-medium ${input.length > 4500 ? 'text-red-500' : 'text-slate-400 dark:text-[#8b949e]'}`}>
                                {input.length} / 5000 characters
                            </span>
                        </div>
                    </div>

                    <div className="px-6 py-3 flex flex-wrap gap-2 items-center justify-center mb-4">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Examples:</span>
                        {sampleTexts.map((text, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setInput(text)}
                                disabled={isLoading}
                                className="text-xs bg-slate-100 dark:bg-[#21262d] hover:bg-slate-200 dark:hover:bg-[#30363d] text-slate-600 dark:text-[#c9d1d9] dark:border dark:border-[#30363d] px-3 py-1.5 rounded-full transition-colors truncate max-w-[200px]"
                            >
                                {text}
                            </button>
                        ))}
                    </div>

                    <div className="px-2 pb-2 relative">
                        <div className="absolute -top-3 right-6 bg-yellow-400 dark:bg-[#1f2428] text-yellow-900 dark:text-[#e3b341] text-[10px] font-bold px-3 py-1 rounded-full z-10 shadow-sm border border-yellow-300 dark:border-[#30363d] transform rotate-3 transition-colors">
                            Free
                        </div>
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="w-full bg-brand-pink dark:bg-[#238636] hover:bg-[#e11d48] dark:hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 px-6 rounded-2xl transition-all flex justify-center items-center gap-3 text-lg shadow-lg dark:shadow-none shadow-brand-pink/30 hover:shadow-xl hover:shadow-brand-pink/40 dark:border dark:border-[rgba(240,246,252,0.1)]"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Sparkles className="animate-pulse" />
                                    Analyzing Minds...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Wand2 size={22} />
                                    Analyze My Code
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
