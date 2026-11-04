'use client';
import { useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import {
  setIsListening,
  setVoiceError,
  setInputText,
} from '@/features/classroom/state/classroomSlice';

import type { ISpeechRecognition } from '../types/voiceInput.types';
import { useClassroomInteraction } from './useClassroomInteraction';

export function useVoiceInput() {
  const dispatch = useAppDispatch();
  const isListening = useAppSelector((s) => s.classroom.isListening);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const { questionTurn, questionKey } = useClassroomInteraction();
  const allowedRef = useRef(questionTurn);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (recognition) {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onstart = null;
      try { recognition.stop(); } catch { /* The browser may already have stopped it. */ }
    }
    dispatch(setIsListening(false));
  }, [dispatch]);

  useLayoutEffect(() => {
    allowedRef.current = questionTurn;
    stopListening();
  }, [questionTurn, questionKey, stopListening]);
  useEffect(() => () => {
    allowedRef.current = false;
    stopListening();
  }, [stopListening]);

  const startListening = useCallback(() => {
    if (!allowedRef.current) return;
    const SpeechRecognitionAPI =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      dispatch(setVoiceError('Speech recognition is not supported in this browser.'));
      return;
    }

    stopListening();
    dispatch(setVoiceError(null));
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    const current = () => allowedRef.current && recognitionRef.current === recognition;
    recognition.onstart = () => {
      if (current()) dispatch(setIsListening(true));
    };
    recognition.onend = () => {
      if (recognitionRef.current !== recognition) return;
      recognitionRef.current = null;
      dispatch(setIsListening(false));
    };
    recognition.onerror = (e) => {
      if (!current()) return;
      dispatch(setIsListening(false));
      dispatch(setVoiceError(`Voice error: ${e.error}`));
    };
    recognition.onresult = (e) => {
      if (!current()) return;
      const transcript = e.results[0]?.[0]?.transcript;
      if (typeof transcript === 'string') dispatch(setInputText(transcript));
    };

    try {
      recognition.start();
    } catch {
      stopListening();
      dispatch(setVoiceError('Unable to start the microphone. Check browser permissions and try again.'));
    }
  }, [dispatch, stopListening]);

  return { isListening, startListening, stopListening };
}
