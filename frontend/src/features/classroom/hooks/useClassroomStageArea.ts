'use client';

import { useLectureFigureCapture } from './useLectureFigureCapture';
import { useDiscussionWindow } from './useDiscussionWindow';
import { useClassroomLayout } from './useClassroomLayout';

/** The rendered stage owns answer playback as well as its display state. */
export function useClassroomStageArea() {
  useLectureFigureCapture();
  useDiscussionWindow();
  return useClassroomLayout();
}
