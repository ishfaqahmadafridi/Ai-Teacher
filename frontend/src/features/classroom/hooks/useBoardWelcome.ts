 'use client';
import { useCallback } from 'react';
export function useBoardWelcome() {
  const focusQuestion = useCallback(() => {
    document.getElementById('question-input')?.focus();
  }, []);
  return { focusQuestion };
}
