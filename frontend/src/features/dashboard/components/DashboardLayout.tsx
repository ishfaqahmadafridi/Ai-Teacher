'use client';

import { memo } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardTopNav, DashboardSideNav } from './navigation';
import { ContinueLearningBanner, DashboardHeroSection } from './hero';
import { LiveClassesSection } from './classes';
import { ProgressAnalyticsCard, AssignmentsSection } from './analytics';

export const DashboardLayout = memo(function DashboardLayout() {
  const {
    searchQuery,
    activeTabId,
    profile,
    continueLearning,
    liveClasses,
    assignments,
    handleSearchChange,
    handleSelectTab,
    handleJoinClass,
    handleResumeCourse,
  } = useDashboard();

  return (
    <div className="min-h-screen bg-[#0A0F18] font-['Hanken_Grotesk',sans-serif] text-[#F8FAFC] relative">
      {/* Glow Orbs in Background */}
      <div
        className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-[#2563eb]/10 rounded-full blur-[120px] pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 right-10 w-[400px] h-[400px] bg-[#712ae2]/10 rounded-full blur-[100px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Top Navbar Header */}
      <DashboardTopNav
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        studentAvatar={profile.avatarUrl}
      />

      {/* Side Navbar Drawer */}
      <DashboardSideNav
        activeTabId={activeTabId}
        onSelectTab={handleSelectTab}
        studentName={profile.name}
        dateFormatted={profile.dateFormatted}
        studentAvatar={profile.avatarUrl}
        onJoinTodayClass={handleJoinClass}
      />

      {/* Main Workspace Area */}
      <main className="md:ml-72 pt-24 px-4 md:px-10 max-w-[1440px] mx-auto min-h-screen pb-10 relative z-10">
        {/* Top Continue Learning Course Banner */}
        <ContinueLearningBanner
          course={continueLearning}
          onResume={() => handleResumeCourse(continueLearning.id)}
          className="mb-6"
        />

        {/* 12-Column Responsive Dashboard Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 Columns): Hero, Live Classes, Assignments */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <DashboardHeroSection
              studentName={profile.name}
              streakDays={profile.streakDays}
              weeklyProgressPercent={profile.weeklyProgressPercent}
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
              weeklyProgressPercent={profile.weeklyProgressPercent}
              streakDays={profile.streakDays}
            />
          </div>
        </div>
      </main>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';
