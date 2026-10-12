 'use client';
import { useMemo } from 'react';
import { useAppSelector } from '@/hooks/useAppStore';
export function useLessonOutline() {
  const chunks = useAppSelector(state => state.classroom.chunks);
  return useMemo(() => chunks.flatMap((chunk, index) => chunk.key_point ? [{ id: `step-${index}`, title: chunk.key_point }] : []), [chunks]);
}
