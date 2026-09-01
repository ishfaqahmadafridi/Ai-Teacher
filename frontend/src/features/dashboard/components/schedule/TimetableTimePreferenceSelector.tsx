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
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Clock className="w-4 h-4 text-purple-400" />
          Preferred Time of Day
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {TIME_PREFERENCE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectTime(opt.id as PreferredTimeOfDay)}
              className={`p-3 rounded-xl text-left border transition-all ${
                preferredTime === opt.id
                  ? 'bg-purple-600/20 border-purple-500/80 text-white ring-1 ring-purple-500/50'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="block text-xs font-bold text-white">{opt.label}</span>
              <span className="block text-[11px] text-slate-400 mt-0.5">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

TimetableTimePreferenceSelector.displayName = 'TimetableTimePreferenceSelector';
