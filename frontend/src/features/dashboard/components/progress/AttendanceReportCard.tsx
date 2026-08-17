'use client';

import { memo } from 'react';
import { CalendarCheck2, Download, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAttendanceReport } from '../../hooks/useAttendanceReport';
import { AttendanceLogItem } from './AttendanceLogItem';
import type { AttendanceReportCardProps } from '../../types/progress.types';

export const AttendanceReportCard = memo(function AttendanceReportCard({
  attendanceLogs,
  studentName,
  onDownloadReport,
  className = '',
}: AttendanceReportCardProps) {
  const {
    recentAbsentLogs,
    absentCount,
    presentCount,
    attendanceRatePercent,
    handleDownloadReport,
  } = useAttendanceReport({ attendanceLogs, studentName });

  const onDownloadClick = onDownloadReport || handleDownloadReport;

  return (
    <div
      className={`bg-[#0F172A] border border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 ${className}`}
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] text-xs font-bold uppercase tracking-wider mb-2 border border-[#10B981]/30">
            <CalendarCheck2 className="w-4 h-4 text-[#10B981]" />
            <span>Attendance & Absence Report</span>
          </div>
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-white">
            Class Attendance History & Missed Sessions
          </h3>
        </div>

        {/* Download CSV Button */}
        <button
          type="button"
          onClick={onDownloadClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-lg shadow-[#2563EB]/25 transition-all duration-200 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Full Report (.CSV)</span>
        </button>
      </div>

      {/* Attendance Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#090D16] p-4 rounded-2xl border border-[#1E293B] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">
              Attendance Rate
            </div>
            <div className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-[#10B981]">
              {attendanceRatePercent}%
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

      {/* Last 3 Missed / Absent Classes Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F59E0B]" />
            <span>Last 3 Missed / Absent Classes</span>
          </h4>
          <span className="text-[11px] text-[#64748B]">
            Showing 3 of {absentCount} missed sessions
          </span>
        </div>

        {recentAbsentLogs.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#090D16] border border-[#1E293B] text-center text-xs text-[#10B981] font-semibold">
            Perfect Attendance! No missed classes recorded recently.
          </div>
        ) : (
          <div className="space-y-3">
            {recentAbsentLogs.map((log) => (
              <AttendanceLogItem key={log.id} record={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

AttendanceReportCard.displayName = 'AttendanceReportCard';
