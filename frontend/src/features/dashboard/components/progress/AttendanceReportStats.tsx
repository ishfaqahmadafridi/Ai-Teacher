'use client';

import { memo } from 'react';
import { CalendarCheck2, CheckCircle2, XCircle } from 'lucide-react';
import type { AttendanceReportStatsProps } from '../../types/progress.types';

export const AttendanceReportStats = memo(function AttendanceReportStats({ attendanceRatePercent, presentCount, absentCount }: AttendanceReportStatsProps) {
  return (
    <>
      {/* Attendance Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#090D16] p-4 rounded-2xl border border-[#1E293B] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">
              Attendance Rate
            </div>
            <div className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-[#10B981]">
              {attendanceRatePercent === null ? '—' : `${attendanceRatePercent}%`}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 text-[#10B981] flex items-center justify-center">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#090D16] p-4 rounded-2xl border border-[#1E293B] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">
              Sessions Attended
            </div>
            <div className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-white">
              {presentCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/20 text-[#38BDF8] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#090D16] p-4 rounded-2xl border border-[#1E293B] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">
              Missed / Absent
            </div>
            <div className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-[#EF4444]">
              {absentCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EF4444]/20 text-[#EF4444] flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>


    </>
  );
});

AttendanceReportStats.displayName = 'AttendanceReportStats';
