'use client';

import { useAttendanceHistory } from '../../hooks/useAttendanceHistory';
import { memo } from 'react';
import { useClassProgressSection } from '../../hooks/useClassProgressSection';
import { ClassBehaviorCard } from './ClassBehaviorCard';
import { TeacherQuestionsCard } from './TeacherQuestionsCard';
import { AttendanceReportCard } from './AttendanceReportCard';
import type { ClassProgressSectionProps } from '../../types/progress.types';

export const ClassProgressSection = memo(function ClassProgressSection(
  props: ClassProgressSectionProps
) {
  const history = useAttendanceHistory(props.attendanceLogs === undefined);
  const { className = '', ...options } = props;
  const { studentName, behaviorMetrics, questionsList, attendanceLogs } =
    useClassProgressSection({ ...options, attendanceLogs: options.attendanceLogs ?? history.data?.attendanceLogs });

  return (
    <div className={`space-y-8 ${className}`}>
      {/* 1. Live Class Behavior & Rough Conduct Tracker */}
      <ClassBehaviorCard metrics={behaviorMetrics} />

      {/* 2. Teacher Q&A Topic Relevance Analytics */}
      <TeacherQuestionsCard questions={questionsList} />

      {options.attendanceLogs === undefined && history.isPending && <p role="status" className="text-slate-400">Loading attendance history…</p>}
      {(history.isError || history.downloadError) && <p role="alert" className="text-rose-400">Attendance history or export could not be loaded. Please retry.</p>}
      {/* 3. Attendance Report & Last 3 Missed Classes with CSV Download */}
      {(options.attendanceLogs !== undefined || history.isSuccess) && <AttendanceReportCard
        attendanceLogs={attendanceLogs}
        summary={options.attendanceLogs === undefined ? history.data?.summary : undefined}
        recentMissed={options.attendanceLogs === undefined ? history.data?.recentMissed : undefined}
        onDownloadReport={options.attendanceLogs === undefined ? history.download : undefined}
        studentName={studentName}
      />}
    </div>
  );
});

ClassProgressSection.displayName = 'ClassProgressSection';
