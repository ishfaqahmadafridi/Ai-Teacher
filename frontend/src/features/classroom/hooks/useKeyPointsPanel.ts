'use client';

import { useAppSelector } from '@/hooks/useAppStore';

export function useKeyPointsPanel() {
  const points = useAppSelector((s) => s.classroom.chalkboardPoints);
  return { points };
}
