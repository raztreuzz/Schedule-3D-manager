import { HiCalendar, HiLockClosed, HiRefresh, HiClipboardList } from 'react-icons/hi';

export default function TopBar({ days, selectedDay, onDayChange, showAllDays, onToggleAllDays, onReset, showTodoPanel, onToggleTodoPanel }) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start pointer-events-auto w-full gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]" />
          <span className="text-[9px] font-black tracking-[0.4em] text-cyan-400/80 uppercase">
            Timeline_Engine_v9.2
          </span>
        </div>
        <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter text-white leading-none uppercase outline-text">
          {showAllDays ? "SEMANA" : days[selectedDay]}
        </h1>
      </div>

      <nav className="flex flex-col gap-3">
        {/* Botones superiores */}
        <div className="flex gap-2">
          <button
            onClick={onToggleTodoPanel}
            className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 ${
              showTodoPanel
                ? 'bg-cyan-500 text-white shadow-[0_0_20px_#06b6d4]'
                : 'bg-black/60 border border-white/10 text-slate-500 hover:text-white'
            }`}
            title="Mostrar/Ocultar lista de tareas"
          >
            <HiClipboardList size={14} />
            TAREAS
          </button>

          <button
            onClick={onToggleAllDays}
            className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 ${
              showAllDays
                ? 'bg-purple-500 text-white shadow-[0_0_20px_#a855f7]'
                : 'bg-black/60 border border-white/10 text-slate-500 hover:text-white'
            }`}
          >
            {showAllDays ? <HiLockClosed size={14} /> : <HiCalendar size={14} />}
            VER TODO
          </button>

          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 bg-black/60 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500"
            title="Resetear horario a valores por defecto"
          >
            <HiRefresh size={14} />
          </button>
        </div>

        {/* Selectores de días */}
        <div className="flex flex-wrap gap-1.5 bg-black/60 border border-white/10 p-2 rounded-2xl backdrop-blur-2xl">
          {days.map((day, i) => (
            <button
              key={i}
              onClick={() => {
                onToggleAllDays(false);
                onDayChange(i);
              }}
              className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all ${
                selectedDay === i && !showAllDays
                  ? 'bg-cyan-500 text-black shadow-[0_0_20px_#06b6d4]'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              {day.slice(0, 3).toUpperCase()}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}

