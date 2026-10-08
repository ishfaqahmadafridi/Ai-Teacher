'use client';

import { formatScheduleTimeSlot } from '../../utilities/scheduleTimeFormat';

import { memo } from 'react';
import type { ScheduleGridHeaderProps } from '../../types/schedule.types';

export const ScheduleGridHeader = memo(function ScheduleGridHeader({
  slots,
  className = '',
}: ScheduleGridHeaderProps) {
  return (
    <div style={{ gridTemplateColumns: 'var(--schedule-columns)' }} className={`grid gap-3 mb-3 border-b border-[#1E293B] pb-4 ${className}`}>
      <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center justify-start px-3">
        Day
      </div>
      {slots.map((slot) => (
        <div
          key={formatScheduleTimeSlot(slot)}
          className="text-left px-4 font-['Hanken_Grotesk',sans-serif] text-xs font-semibold tabular-nums text-slate-300 py-2.5"
        >
          {formatScheduleTimeSlot(slot)}
        </div>
      ))}
    </div>
  );
});

ScheduleGridHeader.displayName = 'ScheduleGridHeader';
