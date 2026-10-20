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
        <label className="flex items-center gap-2 text-xs font-semibold text-dashboard-muted uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-dashboard-primary" />
          Maximum Classes Per Day
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {MAX_CLASSES_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              aria-pressed={maxClassesPerDay === opt.id}
              type="button"
              onClick={() => onSelectMaxClasses(opt.id as MaxClassesPerDay)}
              className={`p-2.5 rounded-xl text-center border transition-all ${
                maxClassesPerDay === opt.id
                  ? 'bg-dashboard-selected border-dashboard-primary/40 text-dashboard-text ring-1 ring-dashboard-primary/20'
                  : 'bg-dashboard-subtle/40 border-dashboard-border/60 text-dashboard-muted hover:bg-dashboard-subtle hover:text-dashboard-muted'
              }`}
            >
              <span className="block text-xs font-bold text-dashboard-text">{opt.label}</span>
              <span className="block text-[10px] text-dashboard-muted mt-0.5">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

TimetableMaxClassesSelector.displayName = 'TimetableMaxClassesSelector';
