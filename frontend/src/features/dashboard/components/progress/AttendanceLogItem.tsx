'use client';

import { memo } from 'react';
import { CalendarX, AlertCircle } from 'lucide-react';
import type { AttendanceLogItemProps } from '../../types/progress.types';

export const AttendanceLogItem = memo(function AttendanceLogItem({
  record,
  className = '',
}: AttendanceLogItemProps) {
  return (
    <div
      className={`p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-dashboard-warning/5 border border-dashboard-warning/15 text-dashboard-warning flex items-center justify-center shrink-0 mt-0.5">
          <CalendarX className="w-4.5 h-4.5" />
        </div>
        <div>
          <h5 className="font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-dashboard-text flex items-center gap-2">
            <span>{record.className}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-dashboard-subtle text-dashboard-muted border border-dashboard-border">
              {record.subject}
            </span>
          </h5>
          <div className="text-xs text-dashboard-muted mt-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-dashboard-warning" />
            <span>{record.missedReason || 'Unexcused Missed Lecture Session'}</span>
          </div>
        </div>
      </div>

      <div className="text-right shrink-0">
        <div className="text-xs font-mono font-bold text-dashboard-muted bg-dashboard-subtle px-2.5 py-1 rounded-lg border border-dashboard-border inline-block">
          {record.dateFormatted}
        </div>
      </div>
    </div>
  );
});

AttendanceLogItem.displayName = 'AttendanceLogItem';
