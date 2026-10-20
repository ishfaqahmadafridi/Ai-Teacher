'use client';

import { memo } from 'react';
import { ScheduleItemCard } from './ScheduleItemCard';
import type { ScheduleTimelineItemProps } from '../../types/schedule.types';

export const ScheduleTimelineItem = memo(function ScheduleTimelineItem({
  item,
  isLast,
  onJoinClass,
  onSelectNoticeItem,
  className = '',
}: ScheduleTimelineItemProps) {
  return (
    <div className={`relative flex items-start gap-4 ${className}`}>
      {/* Vertical Timeline Indicator for desktop */}
      <div className="hidden sm:flex flex-col items-center self-stretch shrink-0 pt-6">
        <div className="w-4 h-4 rounded-full bg-dashboard-primary border-4 border-dashboard-border shadow-none z-10" />
        {!isLast && (
          <div className="w-0.5 flex-1 bg-dashboard-primary my-1" />
        )}
      </div>

      {/* Slot Card */}
      <div className="flex-1">
        <ScheduleItemCard item={item} onJoinClass={onJoinClass} onSelectNoticeItem={onSelectNoticeItem} />
      </div>
    </div>
  );
});

ScheduleTimelineItem.displayName = 'ScheduleTimelineItem';
