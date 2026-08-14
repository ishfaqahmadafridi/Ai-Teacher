'use client';

import { memo } from 'react';
import { useDashboardOverviewGrid } from '../hooks';
import { DashboardHeroSection, ContinueLearningBanner } from './hero';
import { ProgressAnalyticsCard } from './analytics';
import { RegisteredCoursesSection } from './courses';
import type { DashboardOverviewGridProps } from '../types/dashboard.types';

export const DashboardOverviewGrid = memo(function DashboardOverviewGrid({
  studentName,
  streakDays,
  weeklyProgressPercent,
  continueLearning,
  registeredCourses,
  onJoinClass,
  onResumeCourse,
  onOpenRegisterCourseModal,
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

      {/* Main Dashboard Layout Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Section (7 Columns): Overall Performance Analytics Card */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <ProgressAnalyticsCard
            weeklyProgressPercent={weeklyProgressPercent}
            streakDays={streakDays}
          />
        </div>

        {/* Right Section (5 Columns): Registered Courses & Discipline Overview */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <RegisteredCoursesSection
            courses={registeredCourses}
            onJoinCourse={handleJoinClass}
            onOpenRegisterModal={onOpenRegisterCourseModal}
          />
        </div>
      </div>
    </div>
  );
});

DashboardOverviewGrid.displayName = 'DashboardOverviewGrid';
