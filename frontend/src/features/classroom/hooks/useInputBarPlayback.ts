'use client';

import { useInputBar } from './useInputBar';

export function useInputBarPlayback() {
  const { isPlaying, isPaused, chunks, handlePlayPause, stop } = useInputBar();

  return {
    isPlaying,
    isPaused,
    chunks,
    handlePlayPause,
    stop,
  };
}
