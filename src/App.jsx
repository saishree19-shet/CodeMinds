import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import InputBox from './components/InputBox';
import Loader from './components/Loader';
import ResultCards from './components/ResultCards';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const analyzeCode = async (input) => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://127.0.0.1:5000' 
        : '/api';
      const response = await fetch(`${apiUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze code");
      }

      setResults(data);
      toast.dismiss("analyze");
      toast.success("Analysis complete!", { style: { background: '#333', color: '#fff' } });

    } catch (err) {
      console.error(err);
      let userMessage = err.message;
      
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        userMessage = "Cannot connect to the AI backend. Please ensure the server is running (node server.js)";
      }
      
      setError(userMessage || "An error occurred while analyzing the code.");
      toast.dismiss("analyze");
      toast.error("Analysis failed", { style: { background: '#333', color: '#fff' } });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className={`min-h-screen relative flex flex-col font-sans overflow-x-hidden transition-colors ${isDarkMode ? 'dark bg-[#0d1117] text-[#c9d1d9]' : 'bg-white'}`}>
      <Toaster position="top-right" />
      <div className="fixed inset-0 bg-gradient-to-b from-brand-light via-white to-white dark:hidden pointer-events-none"></div>

      <div className="relative z-10 flex-grow flex flex-col">
        <header className="w-full p-4 sm:p-6 flex justify-between items-center max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-brand-pink font-display font-bold text-2xl tracking-tight">
            <div className="bg-brand-pink text-white p-1 rounded-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 3.8-12.8M15 12l3 3a22 22 0 0 0 12.8-3.8"></path><path d="M20 20l-4-4"></path><path d="M12 15V9"></path><path d="M9 12h6"></path></svg>
            </div>
            <span className="text-slate-900 dark:text-[#c9d1d9]">CodeMinds</span>
          </div>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center justify-center p-2 rounded-full border border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] text-slate-500 dark:text-[#8b949e] hover:bg-slate-50 dark:hover:text-[#c9d1d9] transition-colors shadow-sm"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        <main className="flex-grow w-full max-w-5xl mx-auto p-4 sm:p-8 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!isLoading && !results && (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <InputBox onAnalyze={analyzeCode} isLoading={isLoading} />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-center max-w-3xl mx-auto"
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )}

            {isLoading && (
              <motion.div
                key="loader"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="mt-20"
              >
                <Loader />
              </motion.div>
            )}

            {!isLoading && results && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ResultCards results={results} onReset={handleReset} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="w-full bg-[#141521] dark:bg-[#010409] dark:border-t dark:border-[#30363d] text-gray-400 dark:text-[#8b949e] py-12 px-6 mt-20 relative overflow-hidden transition-colors">
          <div className="max-w-md mx-auto flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-4 text-brand-pink font-display font-bold text-2xl tracking-tight">
              <div className="bg-brand-pink text-white p-1 rounded-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 3.8-12.8M15 12l3 3a22 22 0 0 0 12.8-3.8"></path><path d="M20 20l-4-4"></path><path d="M12 15V9"></path><path d="M9 12h6"></path></svg>
              </div>
              <span className="text-white">CodeMinds</span>
            </div>
            <p className="text-sm mb-6 max-w-xs">High-performance code analysis and debugging insights.</p>
            <div className="w-full h-px bg-slate-800 dark:bg-[#30363d] mb-6 transition-colors"></div>
            <p className="text-xs mb-6 font-medium">© 2026 CodeMinds. All rights reserved.</p>
            <div className="flex gap-6 text-sm font-semibold">
              <span className="hover:text-white dark:hover:text-[#58a6ff] cursor-pointer transition-colors">Twitter</span>
              <span className="hover:text-white dark:hover:text-[#58a6ff] cursor-pointer transition-colors">Discord</span>
              <span className="hover:text-white dark:hover:text-[#58a6ff] cursor-pointer transition-colors">Privacy</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
