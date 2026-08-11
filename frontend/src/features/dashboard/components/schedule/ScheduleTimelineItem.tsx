'use client';

import { memo } from 'react';
import { ScheduleItemCard } from './ScheduleItemCard';
import type { ScheduleTimelineItemProps } from '../../types/schedule.types';

export const ScheduleTimelineItem = memo(function ScheduleTimelineItem({
  item,
  isLast,
  onJoinClass,
  className = '',
}: ScheduleTimelineItemProps) {
  return (
    <div className={`relative flex items-start gap-4 ${className}`}>
      {/* Vertical Timeline Indicator for desktop */}
      <div className="hidden sm:flex flex-col items-center self-stretch shrink-0 pt-6">
        <div className="w-4 h-4 rounded-full bg-[#2563EB] border-4 border-[#0F172A] shadow-md shadow-[#2563EB]/50 z-10" />
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-[#2563EB] to-[#1E293B] my-1" />
        )}
      </div>

      {/* Slot Card */}
      <div className="flex-1">
        <ScheduleItemCard item={item} onJoinClass={onJoinClass} />
      </div>
    </div>
  );
});

ScheduleTimelineItem.displayName = 'ScheduleTimelineItem';
