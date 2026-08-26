'use client';

import { useAppSelector } from '@/hooks/useAppStore';

export function useStageOverlay() {
  const loading = useAppSelector((s) => s.classroom.loading);
  const error = useAppSelector((s) => s.classroom.error);
  const loadingStatus = useAppSelector((s) => s.classroom.loadingStatus);

  return {
    loading,
    error,
    loadingStatus,
  };
}
