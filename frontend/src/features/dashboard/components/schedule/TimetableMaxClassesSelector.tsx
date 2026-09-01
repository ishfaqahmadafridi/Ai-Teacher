'use client';

import { memo } from 'react';
import { Calendar } from 'lucide-react';
import { MAX_CLASSES_OPTIONS } from '../../constants/scheduleConstants';
import type {
  MaxClassesPerDay,
  TimetableMaxClassesSelectorProps,
} from '../../types/schedule.types';

export const TimetableMaxClassesSelector = memo(
  function TimetableMaxClassesSelector({
    maxClassesPerDay,
    onSelectMaxClasses,
    className = '',
  }: TimetableMaxClassesSelectorProps) {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-purple-400" />
          Maximum Classes Per Day
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {MAX_CLASSES_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectMaxClasses(opt.id as MaxClassesPerDay)}
              className={`p-2.5 rounded-xl text-center border transition-all ${
                maxClassesPerDay === opt.id
                  ? 'bg-purple-600/20 border-purple-500/80 text-white ring-1 ring-purple-500/50'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="block text-xs font-bold text-white">{opt.label}</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

TimetableMaxClassesSelector.displayName = 'TimetableMaxClassesSelector';
