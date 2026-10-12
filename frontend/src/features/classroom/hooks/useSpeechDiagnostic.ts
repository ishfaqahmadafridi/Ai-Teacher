 'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useChunkPlayer } from './useChunkPlayer';
import { SPEECH_TEST_TEXT, SPEECH_START_TIMEOUT_MS } from '../constants/playbackConstants';

/** Invoke from a real click, without fetching or selecting a named voice. */
export function useSpeechDiagnostic() {
  const [audioStatus, setAudioStatus] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { stop } = useChunkPlayer();
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);
  const testAudio = useCallback(() => {
    stop();
    clearTimer();
    const engine = window.speechSynthesis;
    if (!engine || typeof SpeechSynthesisUtterance === 'undefined') {
      setAudioStatus('This browser does not support speech playback.');
      return;
    }
    engine.resume();
    const utterance = new SpeechSynthesisUtterance(SPEECH_TEST_TEXT);
    utterance.volume = 1;
    utteranceRef.current = utterance;
    setAudioStatus('Testing browser audio…');
    const current = () => utteranceRef.current === utterance;
    utterance.onstart = () => {
      if (!current()) return;
      clearTimer();
      setAudioStatus('Speech started. If you cannot hear it, check site mute and your output device.');
    };
    utterance.onend = () => {
      if (!current()) return;
      clearTimer();
      utteranceRef.current = null;
      setAudioStatus('Browser speech completed. Select Retry audio to replay the lesson.');
    };
    utterance.onerror = event => {
      if (!current()) return;
      clearTimer();
      setAudioStatus(`Browser speech failed: ${event.error}.`);
    };
    timerRef.current = setTimeout(() => {
      if (!current()) return;
      const status = `Browser speech stalled: speaking=${engine.speaking}, pending=${engine.pending}, paused=${engine.paused}. This test bypasses the AI and lesson controller.`;
      utteranceRef.current = null;
      engine.cancel();
      setAudioStatus(status);
    }, SPEECH_START_TIMEOUT_MS);
    engine.speak(utterance);
  }, [stop, clearTimer]);
  useEffect(() => () => {
    clearTimer();
    if (utteranceRef.current) {
      utteranceRef.current = null;
      window.speechSynthesis?.cancel();
    }
  }, [clearTimer]);
  return { audioStatus, testAudio };
}
