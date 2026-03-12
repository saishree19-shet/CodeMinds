import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InputBox from './components/InputBox';
import Loader from './components/Loader';
import ResultCards from './components/ResultCards';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

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

    } catch (err) {
      console.error(err);
      let userMessage = err.message;
      
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        userMessage = "Cannot connect to the AI backend. Please ensure the server is running (node server.js)";
      }
      
      setError(userMessage || "An error occurred while analyzing the code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative flex flex-col font-sans overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-brand-light via-white to-white pointer-events-none"></div>

      <div className="relative z-10 flex-grow flex flex-col">
        <header className="w-full p-4 sm:p-6 flex justify-between items-center max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-brand-pink font-display font-bold text-2xl tracking-tight">
            <div className="bg-brand-pink text-white p-1 rounded-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 3.8-12.8M15 12l3 3a22 22 0 0 0 12.8-3.8"></path><path d="M20 20l-4-4"></path><path d="M12 15V9"></path><path d="M9 12h6"></path></svg>
            </div>
            <span className="text-slate-900">CodeMinds</span>
          </div>
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

        <footer className="w-full bg-[#141521] text-gray-400 py-12 px-6 mt-20 relative overflow-hidden">
          <div className="max-w-md mx-auto flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-4 text-brand-pink font-display font-bold text-2xl tracking-tight">
              <div className="bg-brand-pink text-white p-1 rounded-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 3.8-12.8M15 12l3 3a22 22 0 0 0 12.8-3.8"></path><path d="M20 20l-4-4"></path><path d="M12 15V9"></path><path d="M9 12h6"></path></svg>
              </div>
              <span className="text-white">CodeMinds</span>
            </div>
            <p className="text-sm mb-6 max-w-xs">High-performance code analysis and debugging insights.</p>
            <div className="w-full h-px bg-slate-800 mb-6"></div>
            <p className="text-xs mb-6 font-medium">© 2026 CodeMinds. All rights reserved.</p>
            <div className="flex gap-6 text-sm font-semibold">
              <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
              <span className="hover:text-white cursor-pointer transition-colors">Discord</span>
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
