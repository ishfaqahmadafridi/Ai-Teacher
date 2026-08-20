'use client';

import { memo } from 'react';
import type { DashboardMainContentProps } from '../../types/dashboard.types';
import { RegisteredCoursesSection } from '../courses';
import { ClassScheduleSection } from '../schedule';
import { ClassProgressSection } from '../progress';
import { AssignmentsSection } from '../assignments';
import { DashboardOverviewGrid } from '../overview';

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
}: DashboardMainContentProps) {
  return (
    <main className="md:ml-72 pt-24 px-4 md:px-10 max-w-[1440px] mx-auto min-h-screen pb-10 relative z-10">
      {activeTabId === 'registered_courses' ? (
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
