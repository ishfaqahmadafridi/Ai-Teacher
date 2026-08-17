'use client';

import { memo } from 'react';
import { ScheduleEmptyState } from './ScheduleEmptyState';
import { ScheduleTimelineItem } from './ScheduleTimelineItem';
import { filterScheduleItemsByDay } from '../../utilities/scheduleUtils';
import type { ScheduleSlotListProps } from '../../types/schedule.types';

export const ScheduleSlotList = memo(function ScheduleSlotList({
  selectedDay,
  scheduleItems,
  onJoinClass,
  className = '',
}: ScheduleSlotListProps) {
  const dayItems = filterScheduleItemsByDay(scheduleItems, selectedDay);

  if (dayItems.length === 0) {
    return <ScheduleEmptyState selectedDay={selectedDay} className={className} />;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {dayItems.map((item, index) => (
        <ScheduleTimelineItem
          key={item.id}
          item={item}
          isLast={index === dayItems.length - 1}
          onJoinClass={onJoinClass}
        />
      ))}
    </div>
  );
});

ScheduleSlotList.displayName = 'ScheduleSlotList';
