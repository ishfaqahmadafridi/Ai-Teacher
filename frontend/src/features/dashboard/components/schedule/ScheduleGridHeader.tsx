'use client';

import { memo } from 'react';
import type { ScheduleGridHeaderProps } from '../../types/schedule.types';

export const ScheduleGridHeader = memo(function ScheduleGridHeader({
  weekdays,
  className = '',
}: ScheduleGridHeaderProps) {
  return (
    <div className={`grid grid-cols-7 gap-3 mb-4 border-b border-[#1E293B] pb-4 ${className}`}>
      <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center justify-center">
        Time Slot
      </div>
      {weekdays.map((day) => (
        <div
          key={day}
          className="text-center font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-white bg-[#1E293B]/60 py-2.5 rounded-xl border border-[#334155]"
        >
          {day}
        </div>
      ))}
    </div>
  );
});

ScheduleGridHeader.displayName = 'ScheduleGridHeader';
