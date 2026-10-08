'use client';

import { useMemo, useCallback } from 'react';
import {
  getRecentAbsentLogs,
  generateAttendanceCsvContent,
  downloadCsvFile,
} from '../utilities/progressUtils';
import type { UseAttendanceReportOptions } from '../types/progress.types';

export function useAttendanceReport(options: UseAttendanceReportOptions = {}) {
  const { attendanceLogs = [], studentName = 'Student', summary, recentMissed } = options;

  const localAbsentLogs = useMemo(() => {
    return getRecentAbsentLogs(attendanceLogs, 3);
  }, [attendanceLogs]);

  const totalLogs = summary?.total ?? attendanceLogs.length;
  const localAbsentCount = useMemo(() => {
    return attendanceLogs.filter((l) => l.status === 'absent').length;
  }, [attendanceLogs]);

  const recentAbsentLogs = recentMissed ?? localAbsentLogs;
  const absentCount = summary?.missed ?? localAbsentCount;
  const presentCount = summary?.attended ?? totalLogs - absentCount;
  const attendanceRatePercent = summary ? summary.rate : totalLogs > 0 ? Math.round((presentCount / totalLogs) * 100) : null;

  const handleDownloadReport = useCallback(() => {
    const csvContent = generateAttendanceCsvContent(attendanceLogs, studentName);
    const sanitizedName = studentName.toLowerCase().replace(/\s+/g, '_');
    const filename = `attendance_report_${sanitizedName}.csv`;
    downloadCsvFile(filename, csvContent);
  }, [attendanceLogs, studentName]);

  return {
    recentAbsentLogs,
    totalLogs,
    absentCount,
    presentCount,
    attendanceRatePercent,
    handleDownloadReport,
  };
}
