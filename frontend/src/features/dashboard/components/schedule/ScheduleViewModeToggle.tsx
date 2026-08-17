'use client';

import { memo } from 'react';
import { ListFilter, LayoutGrid } from 'lucide-react';
import type { ScheduleViewModeToggleProps } from '../../types/schedule.types';

export const ScheduleViewModeToggle = memo(function ScheduleViewModeToggle({
  viewMode,
  onViewModeChange,
  className = '',
}: ScheduleViewModeToggleProps) {
  return (
    <div
      className={`flex items-center gap-1.5 bg-[#090D16] p-1.5 rounded-2xl border border-[#1E293B] shrink-0 relative z-10 ${className}`}
    >
      <button
        type="button"
        onClick={() => onViewModeChange('timeline')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
          viewMode === 'timeline'
            ? 'bg-[#2563EB] text-white shadow-md'
            : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
        }`}
      >
        <ListFilter className="w-4 h-4" />
        <span>Day View</span>
      </button>

      <button
        type="button"
        onClick={() => onViewModeChange('grid')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
          viewMode === 'grid'
            ? 'bg-[#2563EB] text-white shadow-md'
            : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span>Week Matrix</span>
      </button>
    </div>
  );
});

ScheduleViewModeToggle.displayName = 'ScheduleViewModeToggle';
