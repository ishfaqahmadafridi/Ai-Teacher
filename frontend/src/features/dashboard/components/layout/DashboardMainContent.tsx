'use client';

import { memo } from 'react';
import type { DashboardMainContentProps } from '../../types/dashboard.types';
import { RegisteredCoursesSection } from '../courses';
import { ClassScheduleSection } from '../schedule';
import { ClassProgressSection } from '../progress';
import { AssignmentsSection } from '../assignments';
import { DashboardOverviewGrid } from '../overview';
import { useAuthStore } from '@/features/auth/state/authStore';
import { getLearningReadiness } from '@/features/onboarding/utils/learningReadiness';
import { LearningSetupActions } from '../overview/LearningSetupActions';

export const DashboardMainContent = memo(function DashboardMainContent({
  activeTabId,
  studentName,
  streakDays,
  weeklyProgressPercent,
  registeredCourses,
  continueLearning,
  liveClasses,
  assignments,
  autoOpenTask,
  onJoinClass,
  onResumeCourse,
  onOpenRegisterCourseModal,
  onOpenTimetable,
}: DashboardMainContentProps) {
  const user = useAuthStore((state) => state.user);
  const { isReady } = getLearningReadiness(user);
  return (
    <main className="px-4 md:px-10 py-8 max-w-[1440px] mx-auto w-full pb-16 relative z-10">
      {(activeTabId === 'dashboard' || !isReady) && (
        <LearningSetupActions onRegisterCourse={onOpenRegisterCourseModal} onOpenTimetable={onOpenTimetable} />
      )}
      {!isReady ? null : activeTabId === 'registered_courses' ? (
        <RegisteredCoursesSection
          courses={registeredCourses}
          onJoinCourse={onJoinClass}
          onOpenRegisterModal={onOpenRegisterCourseModal}
        />
      ) : activeTabId === 'schedule' ? (
        <ClassScheduleSection onJoinClass={onJoinClass} />
      ) : activeTabId === 'class_progress' ? (
        <ClassProgressSection studentName={studentName} />
      ) : activeTabId === 'assignments_quizzes' ? (
        <AssignmentsSection studentName={studentName} autoOpenTask={autoOpenTask} />
      ) : (
        <DashboardOverviewGrid
          studentName={studentName}
          streakDays={streakDays}
          weeklyProgressPercent={weeklyProgressPercent}
          continueLearning={continueLearning}
          registeredCourses={registeredCourses}
          liveClasses={liveClasses}
          assignments={assignments}
          onJoinClass={onJoinClass}
          onResumeCourse={onResumeCourse}
          onOpenRegisterCourseModal={onOpenRegisterCourseModal}
        />
      )}
    </main>
  );
});

DashboardMainContent.displayName = 'DashboardMainContent';
