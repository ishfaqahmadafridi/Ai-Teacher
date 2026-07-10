'use client';
import { useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import {
  setIsListening,
  setVoiceError,
  setInputText,
} from '@/features/classroom/state/classroomSlice';

// Minimal inline types for cross-browser SpeechRecognition
interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: Event & { error: string }) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => void) | null;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: ISpeechRecognitionConstructor;
    webkitSpeechRecognition?: ISpeechRecognitionConstructor;
  }
}

export function useVoiceInput() {
  const dispatch = useAppDispatch();
  const isListening = useAppSelector((s) => s.classroom.isListening);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      dispatch(setVoiceError('Speech recognition is not supported in this browser.'));
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => dispatch(setIsListening(true));
    recognition.onend = () => dispatch(setIsListening(false));
    recognition.onerror = (e) => {
      dispatch(setIsListening(false));
      dispatch(setVoiceError(`Voice error: ${e.error}`));
    };
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      dispatch(setInputText(transcript));
    };

    recognition.start();
  }, [dispatch]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    dispatch(setIsListening(false));
  }, [dispatch]);

  return { isListening, startListening, stopListening };
}
