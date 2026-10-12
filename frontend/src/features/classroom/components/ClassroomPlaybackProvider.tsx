 'use client';
import { memo } from 'react';
import { ClassroomPlaybackContext } from '../context';
import { useClassroomPlaybackProvider } from '../hooks/useClassroomPlaybackProvider';
import type { ClassroomPlaybackProviderProps } from '../types/playback.types';
export const ClassroomPlaybackProvider = memo(function ClassroomPlaybackProvider({ children }: ClassroomPlaybackProviderProps) {
  const controls = useClassroomPlaybackProvider();
  return <ClassroomPlaybackContext.Provider value={controls}>{children}</ClassroomPlaybackContext.Provider>;
});
ClassroomPlaybackProvider.displayName = 'ClassroomPlaybackProvider';
