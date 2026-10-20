'use client';

import { memo } from 'react';
import { CalendarX } from 'lucide-react';
import type { ScheduleEmptyStateProps } from '../../types/schedule.types';

export const ScheduleEmptyState = memo(function ScheduleEmptyState({
  selectedDay,
  className = '',
}: ScheduleEmptyStateProps) {
  return (
    <div
      className={`bg-dashboard-panel border border-dashboard-border rounded-3xl p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-none ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted">
        <CalendarX className="w-8 h-8 text-dashboard-primary" />
      </div>
      <div>
        <h4 className="font-['Hanken_Grotesk',sans-serif] text-lg font-bold text-dashboard-text">
          No Classes Scheduled for {selectedDay}
        </h4>
        <p className="text-sm text-dashboard-muted mt-1 max-w-sm mx-auto">
          You have a free schedule on this day! Select another weekday to view scheduled lectures or lab sessions.
        </p>
      </div>
    </div>
  );
});

ScheduleEmptyState.displayName = 'ScheduleEmptyState';
