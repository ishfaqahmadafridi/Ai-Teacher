'use client';

import { memo } from 'react';
import { CalendarCheck2, CheckCircle2, CalendarX2 } from 'lucide-react';
import type { AttendanceReportStatsProps } from '../../types/progress.types';

export const AttendanceReportStats = memo(function AttendanceReportStats({ attendanceRatePercent, presentCount, absentCount }: AttendanceReportStatsProps) {
  return (
    <>
      {/* Attendance Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-dashboard-panel p-4 rounded-2xl border border-dashboard-border flex items-center justify-between">
          <div>
            <div className="text-[10px] text-dashboard-muted font-bold uppercase tracking-wider">
              Attendance Rate
            </div>
            <div className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-dashboard-text">
              {attendanceRatePercent === null ? '—' : `${attendanceRatePercent}%`}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-dashboard-subtle text-dashboard-muted flex items-center justify-center">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-dashboard-panel p-4 rounded-2xl border border-dashboard-border flex items-center justify-between">
          <div>
            <div className="text-[10px] text-dashboard-muted font-bold uppercase tracking-wider">
              Sessions Attended
            </div>
            <div className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-dashboard-text">
              {presentCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-dashboard-success/5 text-dashboard-success flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-dashboard-panel p-4 rounded-2xl border border-dashboard-border flex items-center justify-between">
          <div>
            <div className="text-[10px] text-dashboard-muted font-bold uppercase tracking-wider">
              Missed / Absent
            </div>
            <div className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-dashboard-warning">
              {absentCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-dashboard-warning/5 text-dashboard-warning flex items-center justify-center">
            <CalendarX2 className="w-5 h-5" />
          </div>
        </div>
      </div>


    </>
  );
});

AttendanceReportStats.displayName = 'AttendanceReportStats';
