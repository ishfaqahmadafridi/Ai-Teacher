'use client';

import { memo } from 'react';
import { ScheduleDaySidebar } from './ScheduleDaySidebar';
import { ScheduleSlotHeader } from './ScheduleSlotHeader';
import { ScheduleSlotList } from './ScheduleSlotList';
import type { ScheduleTimelineViewProps } from '../../types/schedule.types';

export const ScheduleTimelineView = memo(function ScheduleTimelineView({
  days,
  selectedDay,
  onSelectDay,
  scheduleItems,
  onJoinClass,
  className = '',
}: ScheduleTimelineViewProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-start ${className}`}>
      {/* Left Side: Days Sidebar Navigation */}
      <div className="lg:col-span-4 xl:col-span-3">
        <ScheduleDaySidebar
          days={days}
          selectedDay={selectedDay}
          onSelectDay={onSelectDay}
          scheduleItems={scheduleItems}
        />
      </div>

      {/* Right Side: Everyday Classes Time Slots */}
      <div className="lg:col-span-8 xl:col-span-9">
        <ScheduleSlotHeader selectedDay={selectedDay} />
        <ScheduleSlotList
          selectedDay={selectedDay}
          scheduleItems={scheduleItems}
          onJoinClass={onJoinClass}
        />
      </div>
    </div>
  );
});

ScheduleTimelineView.displayName = 'ScheduleTimelineView';
