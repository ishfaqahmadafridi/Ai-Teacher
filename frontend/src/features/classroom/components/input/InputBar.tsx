'use client';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setInputText, setError } from '@/features/classroom/state/classroomSlice';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { useChunkPlayer } from '../../hooks/useChunkPlayer';
import { useClassroomApi } from '../../hooks/useClassroomApi';
import { useState } from 'react';

export function InputBar() {
  const dispatch = useAppDispatch();
  const inputText = useAppSelector((s) => s.classroom.inputText);
  const loading = useAppSelector((s) => s.classroom.loading);
  const isPlaying = useAppSelector((s) => s.classroom.isPlaying);
  const isPaused = useAppSelector((s) => s.classroom.isPaused);
  const voiceError = useAppSelector((s) => s.classroom.voiceError);
  const chunks = useAppSelector((s) => s.classroom.chunks);

  const { isListening, startListening, stopListening } = useVoiceInput();
  const { sendQuestion } = useClassroomApi();
  const { play, pause, resume, stop } = useChunkPlayer();

  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    setLocalError(null);
    await sendQuestion(inputText.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleMicClick = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const handlePlayPause = () => {
    if (!isPlaying && chunks.length > 0) {
      play();
    } else if (isPlaying && !isPaused) {
      pause();
    } else if (isPlaying && isPaused) {
      resume();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Error */}
      {(voiceError || localError) && (
        <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
          {voiceError ?? localError}
          <button
            className="ml-2 text-red-300 hover:text-white"
            onClick={() => { dispatch(setError(null)); setLocalError(null); }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2 bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
        <textarea
          id="question-input"
          rows={2}
          placeholder="Ask Prof. Gemini anything about physics…"
          value={inputText}
          onChange={(e) => dispatch(setInputText(e.target.value))}
          onKeyDown={handleKeyDown}
          disabled={loading || isPlaying}
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 resize-none focus:outline-none disabled:opacity-50"
        />

        {/* Mic button */}
        <button
          id="mic-btn"
          onClick={handleMicClick}
          title={isListening ? 'Stop listening' : 'Voice input'}
          className={`p-2.5 rounded-xl transition-all duration-200 ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
          </svg>
        </button>

        {/* Submit button */}
        <button
          id="ask-btn"
          onClick={handleSubmit}
          disabled={loading || isPlaying || !inputText.trim()}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          )}
          Ask
        </button>
      </div>

      {/* Playback controls */}
      {chunks.length > 0 && (
        <div className="flex items-center gap-2 px-1">
          <button
            id="play-pause-btn"
            onClick={handlePlayPause}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
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
              onClick={stop}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              ⏹ Stop
            </button>
          )}
        </div>
      )}
    </div>
  );
}
