'use client';

import { useCallback, useMemo } from 'react';
import { useAuthStore } from '@/features/auth/state/authStore';
import type { UseDashboardOverviewGridOptions } from '../types/dashboard.types';

export function useDashboardOverviewGrid(options: UseDashboardOverviewGridOptions = {}) {
  const { onJoinClass, assignments } = options;
  const fieldName = useAuthStore((state) => state.user?.selectedInterests?.[0]?.trim());
  const completedAssignments = useMemo(() => assignments?.filter((item) => item.type !== 'quiz' && item.status === 'completed').length ?? 0, [assignments]);
  const totalAssignments = useMemo(() => assignments?.filter((item) => item.type !== 'quiz').length ?? 0, [assignments]);

  const handleJoinClass = useCallback(
    (classId?: string) => {
      onJoinClass?.(classId);
    },
    [onJoinClass]
  );

  return {
    handleJoinClass,
    fieldName,
    completedAssignments,
    totalAssignments,
  };
}
