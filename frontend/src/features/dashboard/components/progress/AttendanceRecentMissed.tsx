'use client';

import { memo } from 'react';
import { Clock } from 'lucide-react';
import { AttendanceLogItem } from './AttendanceLogItem';
import type { AttendanceRecentMissedProps } from '../../types/progress.types';

export const AttendanceRecentMissed = memo(function AttendanceRecentMissed({ totalLogs, recentAbsentLogs, absentCount }: AttendanceRecentMissedProps) {
  return (
    <>
      {/* Last 3 Missed / Absent Classes Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-dashboard-text flex items-center gap-2">
            <Clock className="w-4 h-4 text-dashboard-warning" />
            <span>Last 3 Missed / Absent Classes</span>
          </h4>
          <span className="text-[11px] text-dashboard-muted">
            Showing {recentAbsentLogs.length} of {absentCount} missed sessions
          </span>
        </div>

        {recentAbsentLogs.length === 0 ? (
          <div className="p-6 rounded-2xl bg-dashboard-panel border border-dashboard-border text-center text-xs text-dashboard-success font-semibold">
            {totalLogs === 0 ? 'No attendance data yet. Records appear after your scheduled classes.' : 'No missed classes recorded.'}
          </div>
        ) : (
          <div className="space-y-3">
            {recentAbsentLogs.map((log) => (
              <AttendanceLogItem key={log.id} record={log} />
            ))}
          </div>
        )}
      </div>
    </>
  );
});

AttendanceRecentMissed.displayName = 'AttendanceRecentMissed';
