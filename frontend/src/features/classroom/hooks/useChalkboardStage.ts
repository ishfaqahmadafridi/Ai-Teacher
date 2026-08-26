'use client';

import { useState, useCallback } from 'react';
import { useAppSelector } from '@/hooks/useAppStore';
import { useClassroomApi } from './useClassroomApi';

export function useChalkboardStage() {
  const points = useAppSelector((s) => s.classroom.chalkboardPoints);
  const isWriting = useAppSelector((s) => s.classroom.isWritingOnBoard);
  const topic = useAppSelector((s) => s.classroom.topic);

  const { sendQuestion } = useClassroomApi();
  const [showGrid, setShowGrid] = useState<boolean>(true);

  const toggleGrid = useCallback(() => {
    setShowGrid((prev) => !prev);
  }, []);

  const handleSelectSamplePrompt = useCallback(
    async (prompt: string) => {
      await sendQuestion(prompt);
    },
    [sendQuestion]
  );

  return {
    points,
    isWriting,
    topic,
    showGrid,
    toggleGrid,
    handleSelectSamplePrompt,
  };
}
