'use client';

import { memo } from 'react';
import type { ScheduleSlotHeaderProps } from '../../types/schedule.types';

export const ScheduleSlotHeader = memo(function ScheduleSlotHeader({
  selectedDay,
  className = '',
}: ScheduleSlotHeaderProps) {
  return (
    <div className={`mb-4 flex items-center justify-between ${className}`}>
      <h3 className="font-['Hanken_Grotesk',sans-serif] text-lg font-bold text-white flex items-center gap-2">
        <span>{selectedDay}&apos;s Class Schedule</span>
        <span className="text-xs font-normal text-[#94A3B8] bg-[#1E293B] px-2.5 py-0.5 rounded-full border border-[#334155]">
          Time Slots
        </span>
      </h3>
    </div>
  );
});

ScheduleSlotHeader.displayName = 'ScheduleSlotHeader';
