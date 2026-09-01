'use client';

import { memo } from 'react';
import { STUDY_DAYS_OPTIONS } from '../../constants/scheduleConstants';
import type { TimetableStudyDaysSelectorProps } from '../../types/schedule.types';

export const TimetableStudyDaysSelector = memo(
  function TimetableStudyDaysSelector({
    includeSaturday,
    onSelectIncludeSaturday,
    className = '',
  }: TimetableStudyDaysSelectorProps) {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Study Days Distribution
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STUDY_DAYS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectIncludeSaturday(opt.includeSaturday)}
              className={`p-3 rounded-xl text-left border transition-all ${
                includeSaturday === opt.includeSaturday
                  ? 'bg-purple-600/20 border-purple-500/80 text-white ring-1 ring-purple-500/50'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="block text-xs font-bold text-white">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

TimetableStudyDaysSelector.displayName = 'TimetableStudyDaysSelector';
