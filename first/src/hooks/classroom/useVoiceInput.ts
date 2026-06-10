/**
 * useVoiceInput.ts
 * Hook that wraps the Web Speech API to record the student's spoken question.
 * Returns the transcript, listening state, and start/stop controls.
 */

import { useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import {
  setIsListening,
  setVoiceError,
  setInputText,
} from '../../redux/classroomSlice';

export function useVoiceInput() {
  const dispatch = useAppDispatch();

  const isListening = useAppSelector(state => state.classroom.isListening);
  const voiceError = useAppSelector(state => state.classroom.voiceError);
  const transcript = useAppSelector(state => state.classroom.inputText);

  // Keep a stable reference to the recognition instance
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    dispatch(setVoiceError(null));
    dispatch(setInputText(''));

    // Check browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      dispatch(setVoiceError('Voice input is not supported in this browser. Please use Chrome or Edge.'));
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Allow interim results so the student can see words appear while speaking
    recognition.interimResults = true;

    // Auto-detect language from browser — Gemini will match it in the response
    recognition.lang = navigator.language || 'en-US';

    // Keep listening until the student stops talking
    recognition.continuous = false;

    recognition.onstart = () => {
      dispatch(setIsListening(true));
    };

    recognition.onresult = (event: any) => {
      // Collect all result segments into one string
      let finalText = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const segment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += segment;
        } else {
          interimText += segment;
        }
      }

      // Show interim results in real time; commit final when ready
      dispatch(setInputText(finalText || interimText));
    };

    recognition.onerror = (event: any) => {
      dispatch(setIsListening(false));
      if (event.error === 'no-speech') {
        dispatch(setVoiceError('No speech detected. Please try again.'));
      } else if (event.error === 'not-allowed') {
        dispatch(setVoiceError('Microphone access denied. Please allow microphone in browser settings.'));
      } else {
        dispatch(setVoiceError(`Voice error: ${event.error}`));
      }
    };

    recognition.onend = () => {
      dispatch(setIsListening(false));
    };

    recognition.start();
  }, [dispatch]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    dispatch(setIsListening(false));
  }, [dispatch]);

  const resetTranscript = useCallback(() => {
    dispatch(setInputText(''));
    dispatch(setVoiceError(null));
  }, [dispatch]);

  return {
    transcript,
    isListening,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  };
}
