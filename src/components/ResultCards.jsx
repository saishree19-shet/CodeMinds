import { motion } from 'framer-motion';
import { RefreshCw, Code2, Bot, Ghost, ShieldAlert, Zap, GraduationCap, LayoutPanelLeft } from 'lucide-react';

export default function ResultCards({ results, onReset }) {

    // Parse the JSON data matching our prompt mapping
    // Our 5 keys: "Explain Like I'm 5", "Rubber Duck", "Internet Persona", "Senior Dev Review", "AI Fix Proposal"

    const cardsInfo = [
        {
            title: "Explain Like I'm 5",
            icon: BabyIcon,
            color: "bg-card-blue text-blue-900",
            titleColor: "text-blue-800",
            bodyKey: "Explain Like I'm 5"
        },
        {
            title: "Rubber Duck",
            icon: DuckIcon,
            color: "bg-card-yellow text-yellow-900",
            titleColor: "text-yellow-800",
            bodyKey: "Rubber Duck"
        },
        {
            title: "Internet Persona",
            icon: MemeIcon,
            color: "bg-card-purple text-purple-900",
            titleColor: "text-purple-800",
            bodyKey: "Internet Persona"
        },
        {
            title: "Senior Dev Review",
            icon: GraduationCap,
            color: "bg-card-green text-emerald-900",
            titleColor: "text-emerald-800",
            bodyKey: "Senior Dev Review"
        },
        {
            title: "AI Fix Proposal",
            icon: WrenchIcon,
            color: "bg-card-red text-rose-900 border border-brand-pink/20",
            titleColor: "text-brand-pink",
            bodyKey: "AI Fix Proposal"
        }
    ];

    const complexity = results?.complexityScore || "Medium";

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 font-sans">

            <div className="flex justify-between items-center mb-6 pl-2">
                <div>
                    <h2 className="text-3xl font-display items-center gap-2 font-bold text-slate-800 flex">
                        <LayoutPanelLeft className="text-brand-pink" size={28} />
                        Mirrored Perspectives
                    </h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">Here is how different minds see your code.</p>
                </div>

                <button
                    onClick={onReset}
                    className="bg-white border border-slate-200 text-slate-600 hover:text-brand-pink hover:border-brand-pink hover:bg-brand-light font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 shadow-sm text-sm"
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
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6"
            >
                <div className="flex-grow">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Code Complexity</h3>
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div className={`h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-rose-500 transition-all w-full`} style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}></div>
                    </div>
                </div>
                <div className="flex-shrink-0 text-center">
                    <span className="block text-2xl font-display font-black text-slate-800 tracking-tighter">{complexity}</span>
                    <span className="text-[10px] uppercase font-bold text-brand-pink tracking-widest">Score</span>
                </div>
            </motion.div>

            {/* Perspectives List */}
            {cardsInfo.map((card, index) => {
                const Icon = card.icon;
                const content = results?.[card.bodyKey] || "Perspective failed to load.";

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`${card.color} rounded-[2rem] p-6 sm:p-8 shadow-sm relative overflow-hidden group`}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-white/50 p-3 rounded-2xl shadow-sm backdrop-blur-sm">
                                <Icon size={24} className="opacity-80" />
                            </div>
                            <h3 className={`text-xl font-display font-bold ${card.titleColor}`}>{card.title}</h3>
                        </div>

                        <div className="prose prose-sm prose-p:leading-relaxed max-w-none font-medium opacity-90">
                            {/* Formatting linebreaks or code blocks from raw text */}
                            {content.split('\n').map((paragraph, i) => (
                                <p key={i} className="mb-2 whitespace-pre-wrap font-sans">{paragraph}</p>
                            ))}
                        </div>
                    </motion.div>
                );
            })}
        </div>
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
