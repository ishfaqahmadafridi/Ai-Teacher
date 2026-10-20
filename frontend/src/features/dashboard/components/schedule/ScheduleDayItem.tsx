'use client';

import { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import { SHORT_DAYS } from '../../constants/scheduleConstants';
import type { ScheduleDayItemProps } from '../../types/schedule.types';

export const ScheduleDayItem = memo(function ScheduleDayItem({
  day,
  isSelected,
  count,
  hasLive,
  onSelectDay,
  className = '',
}: ScheduleDayItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelectDay(day)}
      aria-pressed={isSelected}
      className={`group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 text-left shrink-0 min-w-[120px] lg:min-w-0 border cursor-pointer ${
        isSelected
          ? 'bg-dashboard-primary border-dashboard-primary/50 shadow-none text-white'
          : 'bg-dashboard-panel border-dashboard-border hover:border-dashboard-primary/30 hover:bg-dashboard-subtle/60 text-dashboard-muted hover:text-dashboard-text'
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-colors ${
            isSelected
              ? 'bg-dashboard-primary text-white shadow-none'
              : 'bg-dashboard-subtle text-dashboard-muted group-hover:text-dashboard-text group-hover:bg-dashboard-subtle'
          }`}
        >
          {SHORT_DAYS[day]}
        </div>
        <div>
          <div className="font-['Hanken_Grotesk',sans-serif] text-sm font-semibold leading-tight">
            {day}
          </div>
          <div className={`text-[11px] mt-0.5 flex items-center gap-1.5 ${isSelected ? 'text-white/85' : 'text-dashboard-muted'}`}>
            <span>
              {count} {count === 1 ? 'class' : 'classes'}
            </span>
            {hasLive && (
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-semibold text-[9px] border ${isSelected ? 'bg-white/15 text-white border-white/30' : 'bg-dashboard-selected text-dashboard-primary border-dashboard-primary/20'}`}>
                LIVE
              </span>
            )}
          </div>
        </div>
      </div>

      <ChevronRight
        className={`w-4 h-4 transition-transform hidden lg:block ${
          isSelected
            ? 'text-white/85 translate-x-0.5'
            : 'text-dashboard-muted group-hover:text-dashboard-muted'
        }`}
      />
    </button>
  );
});

ScheduleDayItem.displayName = 'ScheduleDayItem';
