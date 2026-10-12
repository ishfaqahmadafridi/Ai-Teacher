'use client';

import { useSpeechDiagnostic } from './useSpeechDiagnostic';
import { useChunkPlayer } from './useChunkPlayer';
import { useInputBar } from './useInputBar';

export function useInputBarToasts() {
  const { voiceError, localError, reactionToast, clearErrors } = useInputBar();

  const { play: retryAudio } = useChunkPlayer();
  const { audioStatus, testAudio } = useSpeechDiagnostic();
  return {
    audioStatus, testAudio,
    retryAudio,
    voiceError,
    localError,
    reactionToast,
    clearErrors,
  };
}
