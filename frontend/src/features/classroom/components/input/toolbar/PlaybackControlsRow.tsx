'use client';

import { memo } from 'react';
import type { PlaybackControlsRowProps } from '../../../types/input.types';

export const PlaybackControlsRow = memo(function PlaybackControlsRow({
  chunksLength,
  isPlaying,
  isPaused,
  onPlayPause,
  onStop,
  className = '',
}: PlaybackControlsRowProps) {
  if (chunksLength === 0) return null;

  return (
    <div className={`flex items-center gap-2 px-1 ${className}`}>
      <button
        id="play-pause-btn"
        type="button"
        onClick={onPlayPause}
        className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer shadow-sm"
      >
        {isPlaying && !isPaused ? (
          <>⏸ Pause</>
        ) : isPaused ? (
          <>▶ Resume</>
        ) : (
          <>▶ Play Lecture</>
        )}
      </button>
      {(isPlaying || isPaused) && (
        <button
          id="stop-btn"
          type="button"
          onClick={onStop}
          className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-red-400 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer shadow-sm"
        >
          ⏹ Stop
        </button>
      )}
    </div>
  );
});

PlaybackControlsRow.displayName = 'PlaybackControlsRow';
