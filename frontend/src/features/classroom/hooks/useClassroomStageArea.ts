'use client';

import { useClassroomLayout } from './useClassroomLayout';

/** The rendered stage owns answer playback as well as its display state. */
export function useClassroomStageArea() {
  return useClassroomLayout();
}
