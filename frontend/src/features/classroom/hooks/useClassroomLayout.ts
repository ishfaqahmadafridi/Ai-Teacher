'use client';

import { useEffect } from 'react';
import { useLessonRecovery } from './useLessonRecovery';
import { useAppSelector } from '@/hooks/useAppStore';
import { useClassroomApi } from './useClassroomApi';
import { useChunkPlayer } from './useChunkPlayer';

export function useClassroomLayout() {
  useLessonRecovery();
  const loading = useAppSelector((s) => s.classroom.loading);
  const isPlaying = useAppSelector((s) => s.classroom.isPlaying);
  const chunks = useAppSelector((s) => s.classroom.chunks);
  const pendingQuestion = useAppSelector((s) => s.classroom.pendingQuestion);
  const currentChunkIndex = useAppSelector((s) => s.classroom.currentChunkIndex);
  const error = useAppSelector((s) => s.classroom.error);
  const loadingStatus = useAppSelector((s) => s.classroom.loadingStatus);
  const diagramType = useAppSelector((s) => s.classroom.diagramType);
  const currentCommand = useAppSelector((s) => s.classroom.currentCommand);
  const currentFormula = useAppSelector((s) => s.classroom.currentFormula);

  const { sendQuestion } = useClassroomApi({ recoverPending: true });
  const { playFrom } = useChunkPlayer();

  // Auto-play lecture chunks when they arrive
  useEffect(() => {
    if (chunks.length > 0 && !isPlaying && !pendingQuestion) {
      playFrom(Math.max(0, currentChunkIndex));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunks]);

  return {
    loading,
    isPlaying,
    chunks,
    error,
    loadingStatus,
    diagramType,
    currentCommand,
    currentFormula,
    sendQuestion,
  };
}
