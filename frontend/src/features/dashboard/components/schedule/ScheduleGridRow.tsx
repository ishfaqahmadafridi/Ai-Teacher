'use client';

import { memo } from 'react';
import { ScheduleGridCell } from './ScheduleGridCell';
import { findScheduleItemBySlotAndDay } from '../../utilities/scheduleUtils';
import type { ScheduleGridRowProps } from '../../types/schedule.types';

export const ScheduleGridRow = memo(function ScheduleGridRow({
  day,
  slots,
  scheduleItems,
  onJoinClass,
  onSelectNoticeItem,
  className = '',
}: ScheduleGridRowProps) {
  return (
    <div style={{ gridTemplateColumns: 'var(--schedule-columns)' }} className={`grid gap-3 items-stretch min-h-[84px] ${className}`}>
      {/* Day Row Header */}
      <div className="sticky left-0 z-10 bg-[#0F172A] flex items-center px-3 py-2 text-sm font-semibold text-slate-200">
        <span className="truncate">{day}</span>
      </div>

      {/* Time Columns */}
      {slots.map((slot) => {
        const item = findScheduleItemBySlotAndDay(scheduleItems, slot, day);
        return (
          <ScheduleGridCell
            key={slot}
            item={item}
            day={day}
            onJoinClass={onJoinClass}
            onSelectNoticeItem={onSelectNoticeItem}
          />
        );
      })}
    </div>
  );
});

ScheduleGridRow.displayName = 'ScheduleGridRow';
