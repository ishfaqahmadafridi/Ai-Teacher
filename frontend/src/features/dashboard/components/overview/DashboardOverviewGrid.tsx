'use client';

import { memo } from 'react';
import { useAuthStore } from '@/features/auth/state/authStore';
import { useDashboardOverviewGrid } from '../../hooks';
import { DashboardHeroSection, ContinueLearningBanner } from '../hero';
import { ProgressAnalyticsCard } from '../analytics';
import type { DashboardOverviewGridProps } from '../../types/dashboard.types';

export const DashboardOverviewGrid = memo(function DashboardOverviewGrid({
  studentName,
  streakDays,
  weeklyProgressPercent,
  onJoinClass,
  className = '',
}: DashboardOverviewGridProps) {
  const fieldName = useAuthStore((state) => state.user?.selectedInterests[0]?.trim());
  const { handleJoinClass } = useDashboardOverviewGrid({
    onJoinClass,
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Banner: Dynamic Student Greeting Hero */}
      <DashboardHeroSection
        studentName={studentName}
        streakDays={streakDays}
        weeklyProgressPercent={weeklyProgressPercent}
        onJoinTodayClass={handleJoinClass}
      />

      {/* Active Field Action Banner */}
      {fieldName && <ContinueLearningBanner fieldName={fieldName} />}

      {/* Featured Overall Performance Analytics Card */}
      <div className="w-full">
        <ProgressAnalyticsCard weeklyProgressPercent={weeklyProgressPercent} streakDays={streakDays} />
      </div>
    </div>
  );
});

DashboardOverviewGrid.displayName = 'DashboardOverviewGrid';
