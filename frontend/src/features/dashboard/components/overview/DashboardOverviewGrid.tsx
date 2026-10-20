'use client';

import { memo } from 'react';
import { useDashboardOverviewGrid } from '../../hooks';
import { DashboardHeroSection, ContinueLearningBanner } from '../hero';
import { ProgressAnalyticsCard } from '../analytics';
import type { DashboardOverviewGridProps } from '../../types/dashboard.types';

export const DashboardOverviewGrid = memo(function DashboardOverviewGrid({ studentName, streakDays, weeklyProgressPercent, assignments, className = '' }: DashboardOverviewGridProps) {
  const { fieldName, completedAssignments, totalAssignments } = useDashboardOverviewGrid({ assignments });
  return (
    <div className={`space-y-7 ${className}`}>
      <div className="space-y-4">
        <DashboardHeroSection studentName={studentName} streakDays={streakDays} weeklyProgressPercent={weeklyProgressPercent} />
        {fieldName && <ContinueLearningBanner fieldName={fieldName} />}
      </div>
      <ProgressAnalyticsCard weeklyProgressPercent={weeklyProgressPercent} streakDays={streakDays} assignmentsCompleted={completedAssignments} totalAssignments={totalAssignments} />
    </div>
  );
});
DashboardOverviewGrid.displayName = 'DashboardOverviewGrid';
