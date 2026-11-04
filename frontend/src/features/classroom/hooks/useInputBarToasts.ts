'use client';

import { useCallback } from 'react';
import { useAppSelector } from '@/hooks/useAppStore';
import { useSpeechDiagnostic } from './useSpeechDiagnostic';
import { useChunkPlayer } from './useChunkPlayer';
import { useInputBar } from './useInputBar';

export function useInputBarToasts() {
  const { voiceError, localError, reactionToast, clearErrors } = useInputBar();

  const { playFrom } = useChunkPlayer();
  const classroom = useAppSelector(state => state.classroom);
  const retryAudio = useCallback(() => {
    if (classroom.isPlaying || classroom.pendingQuestion || !classroom.voiceError) return;
    if (classroom.scheduledSessionId && classroom.classPhase !== 'live') return;
    playFrom(Math.max(0, classroom.currentChunkIndex));
  }, [classroom, playFrom]);
  const { audioStatus, testAudio: runAudioTest } = useSpeechDiagnostic();
  const testAudio = useCallback(() => {
    if (classroom.isPlaying || classroom.pendingQuestion) return;
    if (classroom.scheduledSessionId && classroom.classPhase !== 'live') return;
    runAudioTest();
  }, [classroom, runAudioTest]);
  return {
    audioStatus, testAudio,
    retryAudio,
    voiceError,
    localError,
    reactionToast,
    clearErrors,
  };
}
