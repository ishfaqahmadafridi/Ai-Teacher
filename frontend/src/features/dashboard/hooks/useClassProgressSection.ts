'use client';

import { useMemo } from 'react';
import {
  DEFAULT_BEHAVIOR_METRICS,
  DEFAULT_TEACHER_QUESTIONS,
  DEFAULT_ATTENDANCE_LOGS,
} from '../constants/progressConstants';
import { calculateQuestionStats } from '../utilities/progressUtils';
import type { UseClassProgressSectionOptions } from '../types/progress.types';

export function useClassProgressSection(options: UseClassProgressSectionOptions = {}) {
  const {
    studentName = 'Student',
    behaviorMetrics = DEFAULT_BEHAVIOR_METRICS,
    questionsList = DEFAULT_TEACHER_QUESTIONS,
    attendanceLogs = DEFAULT_ATTENDANCE_LOGS,
  } = options;

  const questionStats = useMemo(() => {
    return calculateQuestionStats(questionsList);
  }, [questionsList]);

  return {
    studentName,
    behaviorMetrics,
    questionsList,
    attendanceLogs,
    questionStats,
  };
}
