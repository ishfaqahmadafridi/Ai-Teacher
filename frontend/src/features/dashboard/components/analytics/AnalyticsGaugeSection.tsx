'use client';

import { memo } from 'react';
import { AnalyticsSummaryItem } from './AnalyticsSummaryItem';
import type { AnalyticsGaugeSectionProps } from '../../types/analytics.types';

export const AnalyticsGaugeSection = memo(function AnalyticsGaugeSection({ weeklyProgressPercent, attendancePercent, classesAttended, totalClasses, className = '' }: AnalyticsGaugeSectionProps) {
  const clampedProgress = Math.min(100, Math.max(0, weeklyProgressPercent));
  const clampedAttendance = Math.min(100, Math.max(0, attendancePercent));
  return (
    <div className={`min-w-0 space-y-3 ${className}`}>
      <AnalyticsSummaryItem label="Weekly goal" value={clampedProgress} unit="%" iconName="target" progressPercent={clampedProgress} description={clampedProgress > 0 ? 'of your weekly learning goal' : 'Begin with your first lesson'} />
      <AnalyticsSummaryItem label="Attendance" value={totalClasses > 0 ? clampedAttendance : '—'} unit={totalClasses > 0 ? '%' : undefined} iconName="calendar" description={totalClasses > 0 ? `${classesAttended} of ${totalClasses} classes attended` : 'No classes recorded yet'} />
    </div>
  );
});
AnalyticsGaugeSection.displayName = 'AnalyticsGaugeSection';
