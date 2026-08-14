'use client';

import { memo } from 'react';
import { useDashboardOverviewGrid } from '../hooks';
import { DashboardHeroSection, ContinueLearningBanner } from './hero';
import { ProgressAnalyticsCard } from './analytics';
import type { DashboardOverviewGridProps } from '../types/dashboard.types';

export const DashboardOverviewGrid = memo(function DashboardOverviewGrid({
  studentName,
  streakDays,
  weeklyProgressPercent,
  continueLearning,
  onJoinClass,
  onResumeCourse,
  className = '',
}: DashboardOverviewGridProps) {
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

      {/* Active Course Continue Learning Action Banner */}
      {continueLearning && (
        <ContinueLearningBanner
          course={continueLearning}
          onResume={() => onResumeCourse?.(continueLearning.id)}
        />
      )}

      {/* Main Overall Performance Analytics Card */}
      <div className="max-w-4xl">
        <ProgressAnalyticsCard
          weeklyProgressPercent={weeklyProgressPercent}
          streakDays={streakDays}
        />
      </div>
    </div>
  );
});

DashboardOverviewGrid.displayName = 'DashboardOverviewGrid';
