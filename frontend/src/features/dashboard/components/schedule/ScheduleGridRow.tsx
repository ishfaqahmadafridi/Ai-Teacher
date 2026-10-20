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
    <div role="row" style={{ gridTemplateColumns: 'var(--schedule-columns)' }} className={`grid items-stretch min-h-[120px] border-b border-dashboard-border last:border-b-0 ${className}`}>
      {/* Day Row Header */}
      <div role="rowheader" className="sticky left-0 z-10 bg-dashboard-panel flex items-start px-4 py-5 text-sm font-semibold text-dashboard-text">
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
