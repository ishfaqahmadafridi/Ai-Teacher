import assert from 'node:assert/strict';
import { test } from 'node:test';
import { load } from './helpers/loadModule.mjs';

const utilities = { getRecentAbsentLogs: logs => logs.filter(log => log.status === 'absent').slice(0, 3), generateAttendanceCsvContent: () => '', downloadCsvFile: () => {} };
const { useAttendanceReport } = load('features/dashboard/hooks/useAttendanceReport.ts', {
  react: { useMemo: fn => fn(), useCallback: fn => fn },
  '../utilities/progressUtils': utilities,
});

test('empty attendance has no invented perfect score', () => {
  const report = useAttendanceReport();
  assert.equal(report.attendanceRatePercent, null);
  assert.equal(report.totalLogs, 0);
});

test('attendance totals use the database summary instead of the bounded history page', () => {
  const report = useAttendanceReport({ attendanceLogs: [], summary: { total: 150, attended: 120, missed: 30, rate: 80 }, recentMissed: [{ id: 'missed', status: 'absent' }] });
  assert.equal(report.totalLogs, 150);
  assert.equal(report.presentCount, 120);
  assert.equal(report.absentCount, 30);
  assert.equal(report.attendanceRatePercent, 80);
  assert.equal(report.recentAbsentLogs.length, 1);
});
