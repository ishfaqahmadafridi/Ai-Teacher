'use client';

import { memo } from 'react';
import { useDashboardLayout } from '../../hooks';
import { DashboardBackgroundGlow } from './DashboardBackgroundGlow';
import { DashboardTopNav, DashboardSideNav } from '../navigation';
import { DashboardMainContent } from './DashboardMainContent';
import { DashboardDialogs } from '../modals';

export const DashboardLayout = memo(function DashboardLayout() {
  const {
    searchQuery,
    activeTabId,
    profile,
    isProfileOpen,
    isSettingsOpen,
    isRegisterCourseModalOpen,
    registeredCourses,
    continueLearning,
    liveClasses,
    assignments,
    autoOpenTask,
    handleSearchChange,
    handleSelectSearchResult,
    handleSelectTab,
    handleNotificationClick,
    handleOpenProfile,
    handleCloseProfile,
    handleSaveProfile,
    handleOpenSettings,
    handleCloseSettings,
    handleOpenRegisterCourseModal,
    handleCloseRegisterCourseModal,
    handleRegisterCourse,
    handleJoinClass,
    handleResumeCourse,
  } = useDashboardLayout();

  return (
    <div className="min-h-screen bg-[#0A0F18] font-['Hanken_Grotesk',sans-serif] text-[#F8FAFC] relative">
      {/* Glow Orbs in Background */}
      <DashboardBackgroundGlow />

      {/* Top Navbar Header */}
      <DashboardTopNav
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSelectSearchResult={handleSelectSearchResult}
        studentAvatar={profile.avatarUrl}
        onOpenProfile={handleOpenProfile}
        onOpenSettings={handleOpenSettings}
        onNotificationClick={handleNotificationClick}
      />

      {/* Side Navbar Drawer */}
      <DashboardSideNav
        activeTabId={activeTabId}
        onSelectTab={handleSelectTab}
        studentName={profile.name}
        dateFormatted={profile.dateFormatted}
        studentAvatar={profile.avatarUrl}
        onJoinTodayClass={handleJoinClass}
        onOpenProfile={handleOpenProfile}
        onOpenSettings={handleOpenSettings}
      />

      {/* Main Workspace Area */}
      <DashboardMainContent
        activeTabId={activeTabId}
        studentName={profile.name}
        streakDays={profile.streakDays}
        weeklyProgressPercent={profile.weeklyProgressPercent}
        registeredCourses={registeredCourses}
        continueLearning={continueLearning}
        liveClasses={liveClasses}
        assignments={assignments}
        autoOpenTask={autoOpenTask}
        onJoinClass={handleJoinClass}
        onResumeCourse={handleResumeCourse}
        onOpenRegisterCourseModal={handleOpenRegisterCourseModal}
      />

      {/* Dashboard Dialog Modals Container */}
      <DashboardDialogs
        isRegisterCourseModalOpen={isRegisterCourseModalOpen}
        onCloseRegisterCourseModal={handleCloseRegisterCourseModal}
        onRegisterCourse={handleRegisterCourse}
        isProfileOpen={isProfileOpen}
        onCloseProfile={handleCloseProfile}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        isSettingsOpen={isSettingsOpen}
        onCloseSettings={handleCloseSettings}
      />
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';
