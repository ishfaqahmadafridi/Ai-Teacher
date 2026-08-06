'use client';

import { useAppSelector } from '@/hooks/useAppStore';

export function useTopBar() {
  const topic = useAppSelector((s) => s.classroom.topic);
  const isPlaying = useAppSelector((s) => s.classroom.isPlaying);
  const currentChunkIndex = useAppSelector((s) => s.classroom.currentChunkIndex);
  const chunks = useAppSelector((s) => s.classroom.chunks);

  const progressPercent =
    isPlaying && chunks.length > 0
      ? Math.round(((currentChunkIndex + 1) / chunks.length) * 100)
      : 0;

  return {
    topicTitle: topic || "Newton's Second Law",
    progressPercent,
    currentChunkIndex,
    totalChunks: chunks.length,
  };
}
