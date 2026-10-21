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
        className={`flex items-start justify-between border-b border-dashboard-border pb-4 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-dashboard-selected border border-dashboard-border text-dashboard-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-dashboard-text">Create class timetable</h3>
            <p className="text-xs text-dashboard-muted">
              Choose courses and class times. Your saved study plans provide the duration and weekly topics.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-dashboard-muted hover:text-dashboard-text hover:bg-dashboard-subtle transition-colors"
          aria-label="Close preferences modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }
);

TimetablePreferencesModalHeader.displayName = 'TimetablePreferencesModalHeader';
