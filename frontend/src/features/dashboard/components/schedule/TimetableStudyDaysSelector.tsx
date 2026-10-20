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
        <label className="block text-xs font-semibold text-dashboard-muted uppercase tracking-wider">
          Study Days Distribution
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STUDY_DAYS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              aria-pressed={includeSaturday === opt.includeSaturday}
              type="button"
              onClick={() => onSelectIncludeSaturday(opt.includeSaturday)}
              className={`p-3 rounded-xl text-left border transition-all ${
                includeSaturday === opt.includeSaturday
                  ? 'bg-dashboard-selected border-dashboard-primary/40 text-dashboard-text ring-1 ring-dashboard-primary/20'
                  : 'bg-dashboard-subtle/40 border-dashboard-border/60 text-dashboard-muted hover:bg-dashboard-subtle hover:text-dashboard-muted'
              }`}
            >
              <span className="block text-xs font-bold text-dashboard-text">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

TimetableStudyDaysSelector.displayName = 'TimetableStudyDaysSelector';
