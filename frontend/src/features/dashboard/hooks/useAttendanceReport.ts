'use client';

import { useMemo, useCallback } from 'react';
import { DEFAULT_ATTENDANCE_LOGS } from '../constants/progressConstants';
import {
  getRecentAbsentLogs,
  generateAttendanceCsvContent,
  downloadCsvFile,
} from '../utilities/progressUtils';
import type { UseAttendanceReportOptions } from '../types/progress.types';

export function useAttendanceReport(options: UseAttendanceReportOptions = {}) {
  const { attendanceLogs = DEFAULT_ATTENDANCE_LOGS, studentName = 'Student' } = options;

  const recentAbsentLogs = useMemo(() => {
    return getRecentAbsentLogs(attendanceLogs, 3);
  }, [attendanceLogs]);

  const totalLogs = attendanceLogs.length;
  const absentCount = useMemo(() => {
    return attendanceLogs.filter((l) => l.status === 'absent').length;
  }, [attendanceLogs]);

  const presentCount = totalLogs - absentCount;
  const attendanceRatePercent = totalLogs > 0 ? Math.round((presentCount / totalLogs) * 100) : 100;

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
