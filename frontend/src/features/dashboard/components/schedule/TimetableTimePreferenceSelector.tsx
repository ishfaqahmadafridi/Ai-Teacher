'use client';

import { memo } from 'react';
import { Clock } from 'lucide-react';
import { TIME_PREFERENCE_OPTIONS } from '../../constants/scheduleConstants';
import type {
  PreferredTimeOfDay,
  TimetableTimePreferenceSelectorProps,
} from '../../types/schedule.types';

export const TimetableTimePreferenceSelector = memo(
  function TimetableTimePreferenceSelector({
    preferredTime,
    onSelectTime,
    className = '',
  }: TimetableTimePreferenceSelectorProps) {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="flex items-center gap-2 text-xs font-semibold text-dashboard-muted uppercase tracking-wider">
          <Clock className="w-4 h-4 text-dashboard-primary" />
          Preferred Time of Day
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {TIME_PREFERENCE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              aria-pressed={preferredTime === opt.id}
              type="button"
              onClick={() => onSelectTime(opt.id as PreferredTimeOfDay)}
              className={`p-3 rounded-xl text-left border transition-all ${
                preferredTime === opt.id
                  ? 'bg-dashboard-selected border-dashboard-primary/40 text-dashboard-text ring-1 ring-dashboard-primary/20'
                  : 'bg-dashboard-subtle/40 border-dashboard-border/60 text-dashboard-muted hover:bg-dashboard-subtle hover:text-dashboard-muted'
              }`}
            >
              <span className="block text-xs font-bold text-dashboard-text">{opt.label}</span>
              <span className="block text-[11px] text-dashboard-muted mt-0.5">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

TimetableTimePreferenceSelector.displayName = 'TimetableTimePreferenceSelector';
