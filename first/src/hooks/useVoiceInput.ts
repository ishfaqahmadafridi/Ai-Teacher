/**
 * useVoiceInput.ts
 * Hook that wraps the Web Speech API to record the student's spoken question.
 * Returns the transcript, listening state, and start/stop controls.
 */

import { useState, useRef, useCallback } from 'react';

interface VoiceInputState {
  transcript: string;        // final recognized text
  isListening: boolean;      // true while microphone is active
  error: string | null;      // error message if something goes wrong
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

/**
 * useVoiceInput
 *
 * Uses the browser's SpeechRecognition API to capture the student's voice.
 * Works in Chrome, Edge, and Safari (with webkit prefix).
 * Language detection is automatic — the browser uses the system language,
 * and Gemini then responds in the detected language.
 *
 * Returns the transcript string once the student stops speaking.
 */
export function useVoiceInput(): VoiceInputState {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep a stable reference to the recognition instance
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    setError(null);
    setTranscript('');

    // Check browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser. Please use Chrome or Edge.');
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
      setIsListening(true);
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
      setTranscript(finalText || interimText);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone in browser settings.');
      } else {
        setError(`Voice error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return { transcript, isListening, error, startListening, stopListening, resetTranscript };
}
