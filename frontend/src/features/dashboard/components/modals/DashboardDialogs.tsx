'use client';

import { memo } from 'react';
import { RegisterCourseModal } from '../courses';
import { UserProfileModal } from '../profile';
import { ProjectSettingsModal } from '../settings';
import type { DashboardDialogsProps } from '../../types';

export const DashboardDialogs = memo(function DashboardDialogs({
  onOpenTimetable,
  isRegisterCourseModalOpen,
  onCloseRegisterCourseModal,
  onRegisterCourse,
  isProfileOpen,
  onCloseProfile,
  profile,
  onSaveProfile,
  isSettingsOpen,
  onCloseSettings,
}: DashboardDialogsProps) {
  return (
    <>
      {/* Course Enrollment Dialog Modal */}
      <RegisterCourseModal
        onOpenTimetable={onOpenTimetable}
        isOpen={isRegisterCourseModalOpen}
        onClose={onCloseRegisterCourseModal}
        onRegisterCourse={onRegisterCourse}
      />

      {/* User Student Profile Dialog Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={onCloseProfile}
        profile={profile}
        onSaveProfile={onSaveProfile}
      />

      {/* Project Settings Dialog Modal */}
      <ProjectSettingsModal
        isOpen={isSettingsOpen}
        onClose={onCloseSettings}
      />
    </>
  );
});

DashboardDialogs.displayName = 'DashboardDialogs';
