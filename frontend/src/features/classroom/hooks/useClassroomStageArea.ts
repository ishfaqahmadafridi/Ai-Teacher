'use client';

import { useAppSelector } from '@/hooks/useAppStore';

export function useClassroomStageArea() {
  const loading = useAppSelector((s) => s.classroom.loading);
  const error = useAppSelector((s) => s.classroom.error);
  const loadingStatus = useAppSelector((s) => s.classroom.loadingStatus);
  const diagramType = useAppSelector((s) => s.classroom.diagramType);
  const currentCommand = useAppSelector((s) => s.classroom.currentCommand);
  const currentFormula = useAppSelector((s) => s.classroom.currentFormula);

  return {
    loading,
    error,
    loadingStatus,
    diagramType,
    currentCommand,
    currentFormula,
  };
}
