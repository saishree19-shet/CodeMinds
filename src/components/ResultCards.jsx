import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Code2, Bot, Ghost, ShieldAlert, Zap, GraduationCap, LayoutPanelLeft, Copy, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResultCards({ results, onReset }) {

    // Parse the JSON data matching our prompt mapping
    // Our 5 keys: "Explain Like I'm 5", "Rubber Duck", "Internet Persona", "Senior Dev Review", "AI Fix Proposal"

    const cardsInfo = [
        {
            title: "Explain Like I'm 5",
            icon: BabyIcon,
            color: "bg-card-blue text-blue-900",
            titleColor: "text-blue-800 dark:text-[#58a6ff]",
            bodyKey: "Explain Like I'm 5"
        },
        {
            title: "Rubber Duck",
            icon: DuckIcon,
            color: "bg-card-yellow text-yellow-900",
            titleColor: "text-yellow-800 dark:text-[#e3b341]",
            bodyKey: "Rubber Duck"
        },
        {
            title: "Internet Persona",
            icon: MemeIcon,
            color: "bg-card-purple text-purple-900",
            titleColor: "text-purple-800 dark:text-[#d2a8ff]",
            bodyKey: "Internet Persona"
        },
        {
            title: "Senior Dev Review",
            icon: GraduationCap,
            color: "bg-card-green text-emerald-900",
            titleColor: "text-emerald-800 dark:text-[#2ea043]",
            bodyKey: "Senior Dev Review"
        },
        {
            title: "AI Fix Proposal",
            icon: WrenchIcon,
            color: "bg-card-red text-rose-900 border border-brand-pink/20",
            titleColor: "text-brand-pink dark:text-[#f85149]",
            bodyKey: "AI Fix Proposal"
        }
    ];

    const complexity = results?.complexityScore || "Medium";

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 font-sans">

            <div className="flex justify-between items-center mb-6 pl-2">
                <div>
                    <h2 className="text-3xl font-display items-center gap-2 font-bold text-slate-800 dark:text-[#c9d1d9] flex transition-colors">
                        <LayoutPanelLeft className="text-brand-pink dark:text-[#8b949e]" size={28} />
                        Mirrored Perspectives
                    </h2>
                    <p className="text-slate-500 dark:text-[#8b949e] font-medium text-sm mt-1 transition-colors">Here is how different minds see your code.</p>
                </div>

                <button
                    onClick={onReset}
                    className="bg-white dark:bg-[#21262d] border border-slate-200 dark:border-[#30363d] text-slate-600 dark:text-[#c9d1d9] hover:text-brand-pink dark:hover:text-[#c9d1d9] hover:border-brand-pink dark:hover:border-[#8b949e] hover:bg-brand-light dark:hover:bg-[#30363d] font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 shadow-sm dark:shadow-none text-sm"
                >
                    <RefreshCw size={16} />
                    <span className="hidden sm:inline">New Code</span>
                </button>
            </div>

            {/* Complexity Score Meter */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white dark:bg-[#161b22] rounded-3xl p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-[#30363d] flex items-center gap-6 transition-colors"
            >
                <div className="flex-grow">
                    <h3 className="text-sm font-bold text-slate-400 dark:text-[#8b949e] uppercase tracking-widest mb-2">Code Complexity</h3>
                    <div className="h-4 w-full bg-slate-100 dark:bg-[#0d1117] rounded-full overflow-hidden flex">
                        <div className={`h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-rose-500 transition-all w-full`} style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}></div>
                    </div>
                </div>
                <div className="flex-shrink-0 text-center">
                    <span className="block text-2xl font-display font-black text-slate-800 dark:text-[#c9d1d9] tracking-tighter">{complexity}</span>
                    <span className="text-[10px] uppercase font-bold text-brand-pink dark:text-[#8b949e] tracking-widest">Score</span>
                </div>
            </motion.div>

            {/* Perspectives List */}
            {cardsInfo.map((card, index) => {
                const content = results?.[card.bodyKey] || "Perspective failed to load.";
                return <ResultCardItem key={index} card={card} content={content} index={index} />;
            })}
        </div>
    );
}

function ResultCardItem({ card, content, index }) {
    const Icon = card.icon;
    const [displayedContent, setDisplayedContent] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let currentIndex = 0;
        const words = content.split(' ');
        setDisplayedContent('');
        setIsTyping(true);

        const interval = setInterval(() => {
            if (currentIndex < words.length) {
                setDisplayedContent(prev => {
                    const prefix = prev ? prev + ' ' : '';
                    return prefix + (words[currentIndex] || '');
                });
                currentIndex++;
            } else {
                setIsTyping(false);
                clearInterval(interval);
            }
        }, 35); // word by word typing

        return () => clearInterval(interval);
    }, [content]);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        toast.success("Copied to clipboard!", {
            style: { background: '#333', color: '#fff' },
            iconTheme: { primary: '#22c55e', secondary: '#fff' }
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`${card.color} rounded-[2rem] p-6 sm:p-8 shadow-sm relative overflow-hidden group dark:bg-[#161b22] dark:border dark:border-[#30363d] dark:shadow-none transition-colors`}
        >
            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="bg-white/50 dark:bg-[#0d1117] p-3 rounded-2xl shadow-sm dark:shadow-none backdrop-blur-sm">
                        <Icon size={24} className="opacity-80 dark:text-[#c9d1d9]" />
                    </div>
                    <h3 className={`text-xl font-display font-bold ${card.titleColor}`}>{card.title}</h3>
                </div>
                
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-white/50 dark:bg-[#0d1117] hover:bg-white/80 dark:hover:bg-[#30363d] px-3 py-1.5 rounded-lg transition-colors border border-black/5 dark:border-[#30363d] text-sm font-semibold"
                >
                    {copied ? <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" /> : <Copy size={16} className="opacity-70 dark:text-[#8b949e]" />}
                    {copied ? <span className="text-green-700 dark:text-green-400">Copied!</span> : <span className="opacity-70 dark:text-[#8b949e]">Copy</span>}
                </button>
            </div>

            <div className="prose prose-sm prose-p:leading-relaxed max-w-none font-medium opacity-90 dark:text-[#c9d1d9]">
                {displayedContent.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-2 whitespace-pre-wrap font-sans">{paragraph}</p>
                ))}
                {isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-current animate-pulse align-middle"></span>}
            </div>
        </motion.div>
    );
}

// Icons
function BabyIcon(props) {
    return <span className="text-2xl" {...props}>👶</span>
}
function DuckIcon(props) {
    return <span className="text-2xl" {...props}>🦆</span>
}
function MemeIcon(props) {
    return <span className="text-2xl" {...props}>🎭</span>
}
function WrenchIcon(props) {
    return <span className="text-2xl" {...props}>🛠️</span>
}
