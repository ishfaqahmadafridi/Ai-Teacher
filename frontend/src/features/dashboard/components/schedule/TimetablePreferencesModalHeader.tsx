'use client';

import { memo } from 'react';
import { Sparkles, X } from 'lucide-react';
import type { TimetablePreferencesModalHeaderProps } from '../../types/schedule.types';

export const TimetablePreferencesModalHeader = memo(
  function TimetablePreferencesModalHeader({
    onClose,
    className = '',
  }: TimetablePreferencesModalHeaderProps) {
    return (
      <div
        className={`flex items-start justify-between border-b border-slate-800 pb-4 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Timetable Planner</h3>
            <p className="text-xs text-slate-400">
              Customize your study schedule preferences before AI generation
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close preferences modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }
);

TimetablePreferencesModalHeader.displayName = 'TimetablePreferencesModalHeader';
