'use client';

import { memo } from 'react';
import { useClassProgressSection } from '../../hooks/useClassProgressSection';
import { ClassBehaviorCard } from './ClassBehaviorCard';
import { TeacherQuestionsCard } from './TeacherQuestionsCard';
import { AttendanceReportCard } from './AttendanceReportCard';
import type { ClassProgressSectionProps } from '../../types/progress.types';

export const ClassProgressSection = memo(function ClassProgressSection(
  props: ClassProgressSectionProps
) {
  const { className = '', ...options } = props;
  const { studentName, behaviorMetrics, questionsList, attendanceLogs } =
    useClassProgressSection(options);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* 1. Live Class Behavior & Rough Conduct Tracker */}
      <ClassBehaviorCard metrics={behaviorMetrics} />

      {/* 2. Teacher Q&A Topic Relevance Analytics */}
      <TeacherQuestionsCard questions={questionsList} />

      {/* 3. Attendance Report & Last 3 Missed Classes with CSV Download */}
      <AttendanceReportCard
        attendanceLogs={attendanceLogs}
        studentName={studentName}
      />
    </div>
  );
});

ClassProgressSection.displayName = 'ClassProgressSection';
