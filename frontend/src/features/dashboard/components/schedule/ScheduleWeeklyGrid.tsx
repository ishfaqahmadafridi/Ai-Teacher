'use client';

import { memo, type CSSProperties } from 'react';
import { WEEKDAYS_MATRIX, DAYS_OF_WEEK } from '../../constants/scheduleConstants';
import { getScheduleTimeSlots } from '../../utilities/scheduleUtils';
import { ScheduleGridHeader } from './ScheduleGridHeader';
import { ScheduleGridRow } from './ScheduleGridRow';
import type { ScheduleWeeklyGridProps } from '../../types/schedule.types';

export const ScheduleWeeklyGrid = memo(function ScheduleWeeklyGrid({
  scheduleItems,
  onJoinClass,
  onSelectNoticeItem,
  className = '',
}: ScheduleWeeklyGridProps) {
  const slots = getScheduleTimeSlots(scheduleItems);
  const weekdays = DAYS_OF_WEEK.filter((day) => WEEKDAYS_MATRIX.includes(day) || scheduleItems.some((item) => item.dayOfWeek === day));
  return (
    <div className={`bg-dashboard-panel border border-dashboard-border rounded-xl overflow-x-auto ${className}`}>
      <div
        role="table"
        aria-label="Weekly class timetable"
        style={{
          '--schedule-columns': `112px repeat(${slots.length}, minmax(260px, 1fr))`,
          minWidth: 112 + slots.length * 260,
        } as CSSProperties}
      >
        {/* Table Header Row */}
        <ScheduleGridHeader slots={slots} />

        {/* Day Rows */}
        <div role="rowgroup">
          {slots.length === 0 && <p className="py-8 text-center text-sm text-dashboard-muted">No saved sessions yet. Generate a plan and accept it to create your timetable.</p>}
          {slots.length > 0 && weekdays.map((day) => (
            <ScheduleGridRow
              key={day}
              day={day}
              slots={slots}
              scheduleItems={scheduleItems}
              onJoinClass={onJoinClass}
              onSelectNoticeItem={onSelectNoticeItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

ScheduleWeeklyGrid.displayName = 'ScheduleWeeklyGrid';
