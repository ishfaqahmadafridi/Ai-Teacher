'use client';

import { memo } from 'react';
import { AttendanceReportHeader } from './AttendanceReportHeader';
import { AttendanceReportStats } from './AttendanceReportStats';
import { AttendanceRecentMissed } from './AttendanceRecentMissed';
import { useAttendanceReport } from '../../hooks/useAttendanceReport';
import type { AttendanceReportCardProps } from '../../types/progress.types';

export const AttendanceReportCard = memo(function AttendanceReportCard({
  attendanceLogs,
  summary,
  recentMissed,
  studentName,
  onDownloadReport,
  className = '',
}: AttendanceReportCardProps) {
  const {
    totalLogs,
    recentAbsentLogs,
    absentCount,
    presentCount,
    attendanceRatePercent,
    handleDownloadReport,
  } = useAttendanceReport({ attendanceLogs, studentName, summary, recentMissed });

  const onDownloadClick = onDownloadReport || handleDownloadReport;

  return (
    <div
      className={`bg-[#0F172A] border border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 ${className}`}
    >
      <AttendanceReportHeader onDownloadClick={onDownloadClick} />
      <AttendanceReportStats attendanceRatePercent={attendanceRatePercent} presentCount={presentCount} absentCount={absentCount} />
      <AttendanceRecentMissed totalLogs={totalLogs} recentAbsentLogs={recentAbsentLogs} absentCount={absentCount} />
    </div>
  );
});

AttendanceReportCard.displayName = 'AttendanceReportCard';
