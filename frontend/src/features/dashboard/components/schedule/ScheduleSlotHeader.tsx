'use client';

import { memo } from 'react';
import type { ScheduleSlotHeaderProps } from '../../types/schedule.types';

export const ScheduleSlotHeader = memo(function ScheduleSlotHeader({
  selectedDay,
  className = '',
}: ScheduleSlotHeaderProps) {
  return (
    <div className={`mb-4 flex items-center justify-between ${className}`}>
      <h3 className="font-['Hanken_Grotesk',sans-serif] text-lg font-bold text-dashboard-text flex items-center gap-2">
        <span>{selectedDay}&apos;s Class Schedule</span>
        <span className="text-xs font-normal text-dashboard-muted bg-dashboard-subtle px-2.5 py-0.5 rounded-full border border-dashboard-border">
          Time Slots
        </span>
      </h3>
    </div>
  );
});

ScheduleSlotHeader.displayName = 'ScheduleSlotHeader';
