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
      className={`relative bg-gradient-to-b from-[#0E172A] via-[#09101F] to-[#070C18] backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#1E293B] font-['Hanken_Grotesk',sans-serif] space-y-6 overflow-hidden ${className}`}
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#004AC6]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row */}
      <AnalyticsHeader
        activeTimeframe={activeTimeframe}
        onSelectTimeframe={handleSelectTimeframe}
      />

      {/* Top Split Grid: Gauge & Attendance + Performance Trend Graph */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#070D1A]/80 p-6 rounded-2xl border border-[#1E293B]">
        <AnalyticsGaugeSection
          weeklyProgressPercent={clampedProgress}
          attendancePercent={attendancePercent}
          classesAttended={classesAttended}
          totalClasses={totalClasses}
          className="lg:col-span-5"
        />

        <AnalyticsTrendGraph
          trendData={trendData}
          className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-[#1E293B] pt-5 lg:pt-0 lg:pl-6"
        />
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

      {/* Bottom Streak Footer */}
      <AnalyticsStreakFooter streakDays={streakDays} />
    </div>
  );
});

ProgressAnalyticsCard.displayName = 'ProgressAnalyticsCard';
