'use client';

import { memo } from 'react';
import { List, Table2 } from 'lucide-react';
import type { ScheduleViewModeToggleProps } from '../../types/schedule.types';

export const ScheduleViewModeToggle = memo(function ScheduleViewModeToggle({
  viewMode,
  onViewModeChange,
  className = '',
}: ScheduleViewModeToggleProps) {
  return (
    <div
      className={`flex items-center gap-1.5 bg-dashboard-panel p-1.5 rounded-2xl border border-dashboard-border shrink-0 relative z-10 ${className}`}
    >
      <button
        type="button"
        onClick={() => onViewModeChange('timeline')}
        aria-pressed={viewMode === 'timeline'}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
          viewMode === 'timeline'
            ? 'bg-dashboard-primary text-white shadow-none'
            : 'text-dashboard-muted hover:text-dashboard-text hover:bg-dashboard-subtle'
        }`}
      >
        <List className="w-4 h-4" aria-hidden="true" />
        <span>Day View</span>
      </button>

      <button
        type="button"
        onClick={() => onViewModeChange('grid')}
        aria-pressed={viewMode === 'grid'}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
          viewMode === 'grid'
            ? 'bg-dashboard-primary text-white shadow-none'
            : 'text-dashboard-muted hover:text-dashboard-text hover:bg-dashboard-subtle'
        }`}
      >
        <Table2 className="w-4 h-4" aria-hidden="true" />
        <span>Week Matrix</span>
      </button>
    </div>
  );
});

ScheduleViewModeToggle.displayName = 'ScheduleViewModeToggle';
