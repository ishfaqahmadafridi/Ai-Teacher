'use client';

import { memo } from 'react';
import type { PlaybackControlsRowProps } from '../../../types/input.types';

import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { toggleSubtitles } from '@/features/classroom/state/classroomSlice';

export const PlaybackControlsRow = memo(function PlaybackControlsRow({
  chunksLength,
  isPlaying,
  isPaused,
  onPlayPause,
  onStop,
  className = '',
}: PlaybackControlsRowProps) {
  const dispatch = useAppDispatch();
  const showSubtitles = useAppSelector((s) => s.classroom.showSubtitles);

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

      {/* Subtitles Toggle Button (User's choice: Hide / Show) */}
      <button
        id="subtitles-toggle-btn"
        type="button"
        onClick={() => dispatch(toggleSubtitles())}
        title={showSubtitles ? 'Hide Subtitles' : 'Show Subtitles'}
        className={`flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-sm ${
          showSubtitles
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
            : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
        }`}
      >
        <span className="text-[10px] tracking-wider uppercase font-bold">CC</span>
        <span>{showSubtitles ? 'On' : 'Off'}</span>
      </button>
    </div>
  );
});


PlaybackControlsRow.displayName = 'PlaybackControlsRow';
