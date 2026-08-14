'use client';

import { useCallback } from 'react';
import type { UseDashboardOverviewGridOptions } from '../types/dashboard.types';

export function useDashboardOverviewGrid(options: UseDashboardOverviewGridOptions = {}) {
  const { onJoinClass } = options;

  const handleJoinClass = useCallback(
    (classId?: string) => {
      onJoinClass?.(classId);
    },
    [onJoinClass]
  );

  return {
    handleJoinClass,
  };
}
