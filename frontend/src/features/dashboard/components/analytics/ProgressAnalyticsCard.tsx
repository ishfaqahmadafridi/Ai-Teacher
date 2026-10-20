'use client';

import { memo } from 'react';
import { useProgressAnalyticsCard } from '../../hooks';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsGaugeSection } from './AnalyticsGaugeSection';
import { AnalyticsTrendGraph } from './AnalyticsTrendGraph';
import { AnalyticsMetricsGrid } from './AnalyticsMetricsGrid';
import { AnalyticsStreakFooter } from './AnalyticsStreakFooter';
import type { ProgressAnalyticsCardProps } from '../../types/dashboard.types';

export const ProgressAnalyticsCard = memo(function ProgressAnalyticsCard({
  weeklyProgressPercent = 0,
  streakDays = 0,
  attendancePercent = 0,
  classesAttended = 0,
  totalClasses = 0,
  classBehaviorScore = 0,
  aiFocusScore = 0,
  conceptMasteryScore = 0,
  assignmentsCompleted = 0,
  totalAssignments = 0,
  quizzesPassed = 0,
  totalQuizzes = 0,
  className = '',
}: ProgressAnalyticsCardProps) {
  const {
    activeTimeframe,
    handleSelectTimeframe,
    clampedProgress,
    trendData,
  } = useProgressAnalyticsCard({ weeklyProgressPercent });

  return (
    <div
      className={`relative bg-dashboard-panel rounded-xl p-5 sm:p-6 border border-dashboard-border font-['Hanken_Grotesk',sans-serif] space-y-5 overflow-hidden ${className}`}
    >
      {/* Header Row */}
      <AnalyticsHeader
        activeTimeframe={activeTimeframe}
        onSelectTimeframe={handleSelectTimeframe}
      />

      <div className="grid gap-6 border-t border-dashboard-border pt-6 lg:grid-cols-[minmax(0,1fr)_220px]">
        <AnalyticsTrendGraph trendData={trendData} activeTimeframe={activeTimeframe} />
        <div className="space-y-3 border-t border-dashboard-border pt-5 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
          <AnalyticsGaugeSection
            weeklyProgressPercent={clampedProgress}
            attendancePercent={attendancePercent}
            classesAttended={classesAttended}
            totalClasses={totalClasses}
          />
          <AnalyticsStreakFooter streakDays={streakDays} />
        </div>
      </div>

      {/* 3-Column Score Cards Grid */}
      <AnalyticsMetricsGrid
        assignmentsCompleted={assignmentsCompleted}
        totalAssignments={totalAssignments}
        quizzesPassed={quizzesPassed}
        totalQuizzes={totalQuizzes}
        aiFocusScore={aiFocusScore}
        conceptMasteryScore={conceptMasteryScore}
        classBehaviorScore={classBehaviorScore}
      />

    </div>
  );
});

ProgressAnalyticsCard.displayName = 'ProgressAnalyticsCard';
