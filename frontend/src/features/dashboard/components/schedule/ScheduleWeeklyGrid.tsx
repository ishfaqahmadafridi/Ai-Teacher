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
    <div className={`bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 sm:p-5 overflow-x-auto ${className}`}>
      <div
        style={{
          '--schedule-columns': `120px repeat(${slots.length}, minmax(240px, 1fr))`,
          minWidth: 120 + slots.length * 252,
        } as CSSProperties}
      >
        {/* Table Header Row */}
        <ScheduleGridHeader slots={slots} />

        {/* Day Rows */}
        <div className="space-y-2">
          {slots.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No saved sessions yet. Generate a plan and accept it to create your timetable.</p>}
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
