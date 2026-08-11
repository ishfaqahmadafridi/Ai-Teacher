'use client';

import { memo } from 'react';
import { Calendar } from 'lucide-react';
import { ScheduleDayItem } from './ScheduleDayItem';
import { filterScheduleItemsByDay, hasLiveSessionOnDay } from '../../utilities/scheduleUtils';
import type { ScheduleDaySidebarProps } from '../../types/schedule.types';

export const ScheduleDaySidebar = memo(function ScheduleDaySidebar({
  days,
  selectedDay,
  onSelectDay,
  scheduleItems,
  className = '',
}: ScheduleDaySidebarProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-2">
        <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
        <span>Select Day</span>
      </div>

      <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
        {days.map((day) => {
          const isSelected = day === selectedDay;
          const count = filterScheduleItemsByDay(scheduleItems, day).length;
          const hasLive = hasLiveSessionOnDay(scheduleItems, day);

          return (
            <ScheduleDayItem
              key={day}
              day={day}
              isSelected={isSelected}
              count={count}
              hasLive={hasLive}
              onSelectDay={onSelectDay}
            />
          );
        })}
      </div>
    </div>
  );
});

ScheduleDaySidebar.displayName = 'ScheduleDaySidebar';
