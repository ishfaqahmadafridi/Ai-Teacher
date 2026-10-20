'use client';

import { formatScheduleTimeSlot } from '../../utilities/scheduleTimeFormat';

import { memo } from 'react';
import type { ScheduleGridHeaderProps } from '../../types/schedule.types';

export const ScheduleGridHeader = memo(function ScheduleGridHeader({
  slots,
  className = '',
}: ScheduleGridHeaderProps) {
  return (
    <div role="row" style={{ gridTemplateColumns: 'var(--schedule-columns)' }} className={`grid border-b border-dashboard-border bg-dashboard-subtle/70 ${className}`}>
      <div role="columnheader" className="sticky left-0 z-20 bg-dashboard-subtle text-xs font-semibold text-dashboard-muted flex items-center px-4 py-4">
        Day
      </div>
      {slots.map((slot) => (
        <div
          key={formatScheduleTimeSlot(slot)}
          role="columnheader"
          className="border-l border-dashboard-border text-left px-4 text-xs font-semibold tabular-nums text-dashboard-muted py-4"
        >
          {formatScheduleTimeSlot(slot)}
        </div>
      ))}
    </div>
  );
});

ScheduleGridHeader.displayName = 'ScheduleGridHeader';
