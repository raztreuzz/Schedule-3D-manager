import React from 'react';
import { HiClock } from 'react-icons/hi';

export default function TimelinePanel({ subjects }) {
  if (!subjects || subjects.length === 0) {
    return null;
  }

  const convertToTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours % 1) * 60);
    return `${h}:${String(m).padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 left-6 bg-black/90 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-4 max-w-sm pointer-events-auto z-20">
      <div className="flex items-center gap-2 mb-3">
        <HiClock className="text-cyan-400" size={18} />
        <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wider">Horario del Día</h3>
      </div>
      
      <div className="space-y-2">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-bold text-white truncate flex-1">{subject.name}</div>
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0 ml-2"
                style={{ backgroundColor: subject.color }}
              />
            </div>
            <div className="text-[10px] text-gray-400">
              📍 {subject.room}
            </div>
            <div className="text-[11px] font-bold text-cyan-400 mt-1">
              {convertToTime(subject.start)} → {convertToTime(subject.end)}
            </div>
            <div className="text-[9px] text-gray-500 mt-1">
              👨‍🏫 {subject.professor.split(' ').slice(0, 2).join(' ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
