'use client';

import { memo } from 'react';
import { useInputBarPlayback } from '../../../hooks/useInputBarPlayback';
import { PlaybackControlsRow } from './PlaybackControlsRow';

export const InputBarPlaybackRow = memo(function InputBarPlaybackRow() {
  const { isPlaying, isPaused, chunks, handlePlayPause, stop } = useInputBarPlayback();

  if (chunks.length === 0) {
    return null;
  }

  return (
    <PlaybackControlsRow
      chunksLength={chunks.length}
      isPlaying={isPlaying}
      isPaused={isPaused}
      onPlayPause={handlePlayPause}
      onStop={stop}
    />
  );
});

InputBarPlaybackRow.displayName = 'InputBarPlaybackRow';
