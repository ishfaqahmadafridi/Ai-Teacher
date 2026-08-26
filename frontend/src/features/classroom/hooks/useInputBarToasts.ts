'use client';

import { useInputBar } from './useInputBar';

export function useInputBarToasts() {
  const { voiceError, localError, reactionToast, clearErrors } = useInputBar();

  return {
    voiceError,
    localError,
    reactionToast,
    clearErrors,
  };
}
