'use client';

import { useCallback } from 'react';
import type { UseDashboardOverviewGridOptions } from '../types/dashboard.types';

export function useDashboardOverviewGrid(options: UseDashboardOverviewGridOptions = {}) {
  const { continueLearningId, onResumeCourse, onJoinClass } = options;

  const handleResume = useCallback(() => {
    if (continueLearningId) {
      onResumeCourse?.(continueLearningId);
    }
  }, [continueLearningId, onResumeCourse]);

  const handleJoinClass = useCallback(
    (classId?: string) => {
      onJoinClass?.(classId);
    },
    [onJoinClass]
  );

  return {
    handleResume,
    handleJoinClass,
  };
}
