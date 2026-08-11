'use client';

import { memo } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardBackgroundGlow } from './DashboardBackgroundGlow';
import { DashboardOverviewGrid } from './DashboardOverviewGrid';
import { DashboardTopNav, DashboardSideNav } from './navigation';
import { RegisteredCoursesSection, RegisterCourseModal } from './courses';
import { ClassScheduleSection } from './schedule';
import { UserProfileModal } from './profile';

export const DashboardLayout = memo(function DashboardLayout() {
  const {
    searchQuery,
    activeTabId,
    profile,
    isProfileOpen,
    isRegisterCourseModalOpen,
    registeredCourses,
    continueLearning,
    liveClasses,
    assignments,
    handleSearchChange,
    handleSelectTab,
    handleOpenProfile,
    handleCloseProfile,
    handleSaveProfile,
    handleOpenRegisterCourseModal,
    handleCloseRegisterCourseModal,
    handleRegisterCourse,
    handleJoinClass,
    handleResumeCourse,
  } = useDashboard();

  return (
    <div className="min-h-screen bg-[#0A0F18] font-['Hanken_Grotesk',sans-serif] text-[#F8FAFC] relative">
      {/* Glow Orbs in Background */}
      <DashboardBackgroundGlow />

      {/* Top Navbar Header */}
      <DashboardTopNav
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        studentAvatar={profile.avatarUrl}
        onOpenProfile={handleOpenProfile}
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
      />

      {/* Main Workspace Area */}
      <main className="md:ml-72 pt-24 px-4 md:px-10 max-w-[1440px] mx-auto min-h-screen pb-10 relative z-10">
        {activeTabId === 'registered_courses' ? (
          <RegisteredCoursesSection
            courses={registeredCourses}
            onJoinCourse={handleJoinClass}
            onOpenRegisterModal={handleOpenRegisterCourseModal}
          />
        ) : activeTabId === 'schedule' ? (
          <ClassScheduleSection onJoinClass={handleJoinClass} />
        ) : (
          <DashboardOverviewGrid
            studentName={profile.name}
            streakDays={profile.streakDays}
            weeklyProgressPercent={profile.weeklyProgressPercent}
            continueLearning={continueLearning}
            liveClasses={liveClasses}
            assignments={assignments}
            onJoinClass={handleJoinClass}
            onResumeCourse={handleResumeCourse}
          />
        )}
      </main>

      {/* Course Registration Modal */}
      <RegisterCourseModal
        isOpen={isRegisterCourseModalOpen}
        onClose={handleCloseRegisterCourseModal}
        onRegisterCourse={handleRegisterCourse}
      />

      {/* Student User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={handleCloseProfile}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';
