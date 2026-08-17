'use client';

import { memo } from 'react';
import { Clock } from 'lucide-react';
import { ScheduleGridCell } from './ScheduleGridCell';
import { findScheduleItemBySlotAndDay } from '../../utilities/scheduleUtils';
import type { ScheduleGridRowProps } from '../../types/schedule.types';

export const ScheduleGridRow = memo(function ScheduleGridRow({
  slot,
  weekdays,
  scheduleItems,
  onJoinClass,
  className = '',
}: ScheduleGridRowProps) {
  return (
    <div className={`grid grid-cols-7 gap-3 items-center min-h-[90px] ${className}`}>
      {/* Time Column */}
      <div className="text-center font-mono text-xs font-bold text-[#38BDF8] bg-[#2563EB]/10 py-3 rounded-xl border border-[#2563EB]/20 flex items-center justify-center gap-1.5 h-full">
        <Clock className="w-3.5 h-3.5" />
        <span className="text-[11px]">{slot}</span>
      </div>

      {/* Day Columns */}
      {weekdays.map((day) => {
        const item = findScheduleItemBySlotAndDay(scheduleItems, slot, day);
        return (
          <ScheduleGridCell
            key={day}
            item={item}
            day={day}
            onJoinClass={onJoinClass}
          />
        );
      })}
    </div>
  );
});

ScheduleGridRow.displayName = 'ScheduleGridRow';
