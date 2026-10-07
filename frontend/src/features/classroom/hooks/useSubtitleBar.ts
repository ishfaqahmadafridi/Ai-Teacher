'use client';

import { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { toggleSubtitles } from '@/features/classroom/state/classroomSlice';

export function useSubtitleBar() {
  const dispatch = useAppDispatch();
  const spokenText = useAppSelector((s) => s.classroom.spokenText);
  const isPlaying = useAppSelector((s) => s.classroom.isPlaying);
  const currentChunkIndex = useAppSelector((s) => s.classroom.currentChunkIndex);
  const showSubtitles = useAppSelector((s) => s.classroom.showSubtitles);
  const subtitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    subtitleRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChunkIndex]);

  const hideSubtitles = () => {
    dispatch(toggleSubtitles());
  };

  return {
    spokenText,
    isVisible: isPlaying && Boolean(spokenText) && showSubtitles,
    subtitleRef,
    hideSubtitles,
  };
}
