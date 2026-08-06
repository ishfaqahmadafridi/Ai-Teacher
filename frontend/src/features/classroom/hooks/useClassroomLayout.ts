'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/hooks/useAppStore';
import { useClassroomApi } from './useClassroomApi';
import { useChunkPlayer } from './useChunkPlayer';

/**
 * Custom Hook orchestrating state selection, API hooks, and chunk playback side-effects
 * for the ClassroomLayout component following Custom Hook Separation Best Practices.
 */
export function useClassroomLayout() {
  const loading = useAppSelector((s) => s.classroom.loading);
  const isPlaying = useAppSelector((s) => s.classroom.isPlaying);
  const chunks = useAppSelector((s) => s.classroom.chunks);

  const { sendQuestion } = useClassroomApi();
  const { play } = useChunkPlayer();

  // Auto-play lecture chunks when they arrive
  useEffect(() => {
    if (chunks.length > 0 && !isPlaying) {
      play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunks]);

  return {
    loading,
    isPlaying,
    chunks,
    sendQuestion,
  };
}
