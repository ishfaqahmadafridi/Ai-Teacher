'use client';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { toggleSubtitles } from '../state/classroomSlice';

export function usePlaybackSubtitles() {
  const dispatch = useAppDispatch();
  const showSubtitles = useAppSelector(state => state.classroom.showSubtitles);
  const onToggleSubtitles = useCallback(() => dispatch(toggleSubtitles()), [dispatch]);
  return { showSubtitles, onToggleSubtitles };
}
