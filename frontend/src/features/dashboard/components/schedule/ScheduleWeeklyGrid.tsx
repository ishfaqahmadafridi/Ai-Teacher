'use client';

import { memo } from 'react';
import { WEEKDAYS_MATRIX, SCHEDULE_TIME_SLOTS } from '../../constants/scheduleConstants';
import { ScheduleGridHeader } from './ScheduleGridHeader';
import { ScheduleGridRow } from './ScheduleGridRow';
import type { ScheduleWeeklyGridProps } from '../../types/schedule.types';

export const ScheduleWeeklyGrid = memo(function ScheduleWeeklyGrid({
  scheduleItems,
  onJoinClass,
  onSelectNoticeItem,
  className = '',
}: ScheduleWeeklyGridProps) {
  return (
    <div className={`bg-[#0F172A] border border-[#1E293B] rounded-3xl p-6 shadow-2xl overflow-x-auto ${className}`}>
      <div className="min-w-[850px]">
        {/* Table Header Row */}
        <ScheduleGridHeader weekdays={WEEKDAYS_MATRIX} />

        {/* Time Slot Rows */}
        <div className="space-y-3">
          {SCHEDULE_TIME_SLOTS.map((slot) => (
            <ScheduleGridRow
              key={slot}
              slot={slot}
              weekdays={WEEKDAYS_MATRIX}
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
