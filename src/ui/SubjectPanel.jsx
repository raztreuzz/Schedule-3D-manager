import { Activity, MapPin, RefreshCcw, Sparkles, Terminal } from 'lucide-react';
import { HiClipboardList, HiViewGrid } from 'react-icons/hi';
import { getTodosBySubject, getPendingTodos } from '../core/todos';
import { loadTodos } from '../core/todos';

export default function SubjectPanel({ subject, onConsultAI, loading, onOpenTodos, onOpenDashboard }) {
  if (!subject) {
    return (
      <div className="bg-black/40 p-5 rounded-2xl border border-white/5 inline-flex items-center gap-4 text-slate-500 italic">
        <Terminal size={14} className="text-cyan-500 animate-pulse" />
        <span className="text-[9px] tracking-widest uppercase">Esperando Selección de Nodo...</span>
      </div>
    );
  }

  // Obtener tareas de esta asignatura
  const allTodos = loadTodos();
  const subjectTodos = getTodosBySubject(allTodos, subject.id);
  const pendingCount = getPendingTodos(subjectTodos).length;

  // Formatear horas
  const formatTime = (hour) => {
    const h = Math.floor(hour);
    const m = Math.round((hour % 1) * 60);
    return `${h}:${String(m).padStart(2, '0')}`;
  };

  return (
    <div className="bg-black/90 border border-cyan-500/30 backdrop-blur-3xl p-4 md:p-8 rounded-2xl md:rounded-[2rem] animate-in shadow-2xl">
      <div className="flex items-start md:items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-cyan-500/10 text-cyan-400 flex-shrink-0">
          <Activity size={16} className="md:w-5 md:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tight md:tracking-tighter leading-tight md:leading-none break-words">
            {subject.name}
          </h2>
          <div className="text-[10px] md:text-xs text-cyan-400/70 mt-1 font-semibold">
            ⏰ {formatTime(subject.start)} - {formatTime(subject.end)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-8">
        <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-white/5 border border-white/5">
          <span className="text-[7px] md:text-[8px] text-slate-500 font-black uppercase mb-1 block">
            Catedrático
          </span>
          <div className="text-sm font-bold text-white uppercase">{subject.professor}</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[8px] text-slate-500 font-black uppercase mb-1 block">
            Ubicación
          </span>
          <div className="text-sm font-bold text-cyan-400 italic">
            <MapPin size={12} className="inline mr-1" />
            {subject.room}
          </div>
        </div>
      </div>

      <button
        onClick={() => onConsultAI(subject)}
        disabled={loading}
        className="w-full bg-white hover:bg-cyan-400 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 mb-3"
      >
        {loading ? (
          <RefreshCcw className="animate-spin" size={18} />
        ) : (
          <Sparkles size={18} />
        )}
        <span className="text-[10px] tracking-[0.3em]">CONSULTAR MENTOR IA</span>
      </button>

      {/* Botón de Dashboard de la asignatura */}
      <button
        onClick={onOpenDashboard}
        className="w-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 text-cyan-300 font-black py-3 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 mb-2"
      >
        <HiViewGrid size={18} />
        <span className="text-[10px] tracking-[0.2em]">VER DASHBOARD COMPLETO</span>
      </button>

      {/* Botón de tareas de la asignatura */}
      {pendingCount > 0 && (
        <button
          onClick={onOpenTodos}
          className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 text-purple-300 font-black py-3 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          <HiClipboardList size={18} />
          <span className="text-[10px] tracking-[0.2em]">{pendingCount} TAREA{pendingCount !== 1 ? 'S' : ''} PENDIENTE{pendingCount !== 1 ? 'S' : ''}</span>
        </button>
      )}
    </div>
  );
}

