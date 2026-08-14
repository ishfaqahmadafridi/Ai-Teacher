'use client';

import { memo } from 'react';
import { useDashboardOverviewGrid } from '../hooks';
import { DashboardHeroSection } from './hero';
import { LiveClassesSection } from './classes';
import { ProgressAnalyticsCard } from './analytics';
import { AssignmentsSection } from './assignments';
import type { DashboardOverviewGridProps } from '../types/dashboard.types';

export const DashboardOverviewGrid = memo(function DashboardOverviewGrid({
  studentName,
  streakDays,
  weeklyProgressPercent,
  liveClasses,
  assignments,
  onJoinClass,
  className = '',
}: DashboardOverviewGridProps) {
  const { handleJoinClass } = useDashboardOverviewGrid({
    onJoinClass,
  });

  return (
    <div className={className}>
      {/* 12-Column Responsive Dashboard Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Columns): Hero, Live Classes, Assignments */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <DashboardHeroSection
            studentName={studentName}
            streakDays={streakDays}
            weeklyProgressPercent={weeklyProgressPercent}
            onJoinTodayClass={handleJoinClass}
          />

          <LiveClassesSection
            classes={liveClasses}
            onJoinClass={handleJoinClass}
          />

          <AssignmentsSection assignments={assignments} />
        </div>

        {/* Right Column (4 Columns): Performance Analytics */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ProgressAnalyticsCard
            weeklyProgressPercent={weeklyProgressPercent}
            streakDays={streakDays}
          />
        </div>
      </div>
    </div>
  );
});

DashboardOverviewGrid.displayName = 'DashboardOverviewGrid';
