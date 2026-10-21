'use client';

import { memo } from 'react';
import type { PlaybackControlsRowProps } from '../../../types/input.types';

import { usePlaybackSubtitles } from '../../../hooks/usePlaybackSubtitles';

export const PlaybackControlsRow = memo(function PlaybackControlsRow({
  chunksLength,
  isPlaying,
  isPaused,
  onPlayPause,
  onStop,
  className = '',
}: PlaybackControlsRowProps) {
  const { showSubtitles, onToggleSubtitles } = usePlaybackSubtitles();

  if (chunksLength === 0) return null;

  return (
    <div className={`flex items-center gap-2 px-1 ${className}`}>
      <button
        id="play-pause-btn"
        type="button"
        onClick={onPlayPause}
        className="flex items-center gap-2 text-xs font-mono font-bold text-dashboard-muted hover:text-dashboard-primary px-3 py-1.5 rounded-xl bg-dashboard-subtle hover:bg-dashboard-selected border border-dashboard-border transition-all cursor-pointer shadow-sm"
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
          className="flex items-center gap-2 text-xs font-mono font-bold text-dashboard-muted hover:text-red-400 px-3 py-1.5 rounded-xl bg-dashboard-subtle hover:bg-dashboard-selected border border-dashboard-border transition-all cursor-pointer shadow-sm"
        >
          ⏹ Stop
        </button>
      )}

      {/* Subtitles Toggle Button (User's choice: Hide / Show) */}
      <button
        id="subtitles-toggle-btn"
        type="button"
        onClick={onToggleSubtitles}
        title={showSubtitles ? 'Hide Subtitles' : 'Show Subtitles'}
        className={`flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-sm ${
          showSubtitles
            ? 'bg-dashboard-success/10 border-dashboard-success/30 text-dashboard-success hover:bg-dashboard-success/15'
            : 'bg-dashboard-subtle border-dashboard-border text-dashboard-muted hover:text-dashboard-muted'
        }`}
      >
        <span className="text-[10px] tracking-wider uppercase font-bold">CC</span>
        <span>{showSubtitles ? 'On' : 'Off'}</span>
      </button>
    </div>
  );
});


PlaybackControlsRow.displayName = 'PlaybackControlsRow';
