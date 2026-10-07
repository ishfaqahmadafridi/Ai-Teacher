'use client';

import { useMemo } from 'react';
import {
  DEFAULT_BEHAVIOR_METRICS,
} from '../constants/progressConstants';
import { calculateQuestionStats } from '../utilities/progressUtils';
import type { UseClassProgressSectionOptions } from '../types/progress.types';

export function useClassProgressSection(options: UseClassProgressSectionOptions = {}) {
  const {
    studentName = 'Student',
    behaviorMetrics = DEFAULT_BEHAVIOR_METRICS,
    questionsList = [],
    attendanceLogs = [],
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
