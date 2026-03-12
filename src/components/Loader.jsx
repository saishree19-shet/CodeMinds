import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';

export default function Loader() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 98) return prev;
                return prev + Math.floor(Math.random() * 15) + 5;
            });
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const displayProgress = Math.min(progress, 98);

    return (
        <div className="w-full flex flex-col items-center justify-center py-12 sm:py-20">
            {/* Big Big Robot Circle */}
            <div className="relative mb-12 flex justify-center items-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-full flex justify-center items-center shadow-[0_0_50px_rgba(244,63,94,0.15)] relative z-10"
                >
                    <motion.div
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Bot size={96} className="text-brand-pink drop-shadow-lg" />
                    </motion.div>
                </motion.div>

                {/* Floating sparkles */}
                <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -right-8 top-10 text-pink-300">
                    <Sparkles size={24} />
                </motion.div>
            </div>

            <div className="text-center w-full max-w-sm">
                <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mb-3 tracking-tight">
                    Consulting the duck...
                </h2>
                <p className="text-brand-pink font-medium text-lg mb-10">
                    Brewing your perspectives
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-transparent">
                    <div className="flex justify-between items-end mb-2 px-1">
                        <span className="text-sm font-bold text-slate-500 tracking-wider">ANALYZING CODE</span>
                        <span className="text-sm font-bold text-brand-pink">{displayProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-brand-pink/15 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-brand-pink rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${displayProgress}%` }}
                            transition={{ type: "spring", stiffness: 50 }}
                        />
                    </div>
                </div>

                {/* Bouncing Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-3 h-3 bg-brand-pink rounded-full" />
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-3 h-3 bg-brand-pink/60 rounded-full" />
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-3 h-3 bg-brand-pink/30 rounded-full" />
                </div>
            </div>
        </div>
    );
}
