import type {
  AttendanceLogRecord,
  StudentQuestionItem,
  StudentBehaviorMetrics,
} from '../types/progress.types';

export function checkBanStatus(metrics: StudentBehaviorMetrics) {
  const maxAllowed = metrics.maxAllowedWarnings || 3;
  const currentWarnings = metrics.disruptionWarningsCount || 0;
  const isBanned = currentWarnings >= maxAllowed || metrics.isBanned === true;
  const remainingChances = Math.max(0, maxAllowed - currentWarnings);

  return {
    isBanned,
    maxAllowed,
    currentWarnings,
    remainingChances,
    banNotice: isBanned
      ? 'ACCOUNT & EMAIL PERMANENTLY BANNED — Exceeded maximum 3/3 disruption warnings. Fines or payments are NOT accepted for misbehavior.'
      : `${currentWarnings} / ${maxAllowed} Warning Chances Used (${remainingChances} ${
          remainingChances === 1 ? 'chance' : 'chances'
        } remaining before permanent email ban).`,
  };
}

export function getRecentAbsentLogs(
  logs: AttendanceLogRecord[],
  limit = 3
): AttendanceLogRecord[] {
  return logs
    .filter((log) => log.status === 'absent' || log.status === 'late')
    .slice(0, limit);
}

export function calculateQuestionStats(questions: StudentQuestionItem[]) {
  const total = questions.length;
  const relevantCount = questions.filter((q) => q.isRelevant).length;
  const offTopicCount = total - relevantCount;
  const relevanceRatePercent = total > 0 ? Math.round((relevantCount / total) * 100) : 100;

  return {
    total,
    relevantCount,
    offTopicCount,
    relevanceRatePercent,
  };
}

export function generateAttendanceCsvContent(
  logs: AttendanceLogRecord[],
  studentName = 'Student'
): string {
  const headers = ['Record ID', 'Date', 'Class Name', 'Subject', 'Status', 'Notes/Reason'];
  const rows = logs.map((log) => [
    log.id,
    `"${log.dateFormatted}"`,
    `"${log.className}"`,
    `"${log.subject}"`,
    log.status.toUpperCase(),
    `"${log.missedReason || 'N/A'}"`,
  ]);

  const csvRows = [
    `# Attendance & Behavior Log Report for ${studentName}`,
    `# Generated Date: ${new Date().toLocaleDateString()}`,
    '',
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ];

  return csvRows.join('\n');
}

export function downloadCsvFile(filename: string, csvContent: string): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
