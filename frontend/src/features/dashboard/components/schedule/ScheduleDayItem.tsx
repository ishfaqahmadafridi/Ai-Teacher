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
      className={`group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 text-left shrink-0 min-w-[120px] lg:min-w-0 border cursor-pointer ${
        isSelected
          ? 'bg-gradient-to-r from-[#2563EB]/20 to-[#38BDF8]/10 border-[#38BDF8]/50 shadow-lg shadow-[#2563EB]/10 text-white'
          : 'bg-[#0F172A] border-[#1E293B] hover:border-[#38BDF8]/30 hover:bg-[#1E293B]/60 text-[#94A3B8] hover:text-white'
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-colors ${
            isSelected
              ? 'bg-[#2563EB] text-white shadow-md'
              : 'bg-[#1E293B] text-[#94A3B8] group-hover:text-white group-hover:bg-[#334155]'
          }`}
        >
          {SHORT_DAYS[day]}
        </div>
        <div>
          <div className="font-['Hanken_Grotesk',sans-serif] text-sm font-semibold leading-tight">
            {day}
          </div>
          <div className="text-[11px] text-[#64748B] mt-0.5 flex items-center gap-1.5">
            <span>
              {count} {count === 1 ? 'class' : 'classes'}
            </span>
            {hasLive && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#EF4444]/20 text-[#EF4444] font-bold text-[9px] border border-[#EF4444]/30 animate-pulse">
                LIVE
              </span>
            )}
          </div>
        </div>
      </div>

      <ChevronRight
        className={`w-4 h-4 transition-transform hidden lg:block ${
          isSelected
            ? 'text-[#38BDF8] translate-x-0.5'
            : 'text-[#475569] group-hover:text-[#94A3B8]'
        }`}
      />
    </button>
  );
});

ScheduleDayItem.displayName = 'ScheduleDayItem';
