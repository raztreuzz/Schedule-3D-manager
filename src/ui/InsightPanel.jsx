import { Brain } from 'lucide-react';

export default function InsightPanel({ insight, onClose, visible }) {
  return (
    <div
      className={`absolute top-0 right-0 h-full w-full md:w-[500px] z-20 transition-transform duration-700 ease-in-out ${
        visible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full bg-[#050508] border-l border-white/10 p-12 overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <Brain className="text-purple-500" size={24} />
            <span className="text-[10px] font-black tracking-[0.5em] text-slate-400">
              NEURAL_OUTPUT
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="text-cyan-50/80 leading-relaxed text-lg font-sans italic border-l-2 border-purple-500/50 pl-6 py-4 whitespace-pre-line bg-purple-500/5 rounded-r-2xl">
          {insight}
        </div>
      </div>
    </div>
  );
}

