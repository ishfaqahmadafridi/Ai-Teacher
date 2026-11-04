'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setIsPlaying, setSpokenText, setVoiceError } from '../state/classroomSlice';
import { selectSpeechVoice } from '../utilities/speechVoiceSelection';
import type { TeacherReplyPlayback } from '../types/playback.types';
import { DISCUSSION_REPLY_AUDIO_TIMEOUT_MS } from '../constants/discussionConstants';
import { SPEECH_START_TIMEOUT_MS } from '../constants/playbackConstants';

/** Transient teacher replies never replace the saved lesson's chunks or indices. */
export function useTeacherReplyAudio() {
  const dispatch = useAppDispatch();
  const selectedVoice = useAppSelector(state => state.classroom.selectedVoice);
  const active = useRef<TeacherReplyPlayback | null>(null);
  const cancelReply = useCallback(() => {
    const current = active.current;
    active.current = null;
    if (!current) return;
    clearTimeout(current.timer);
    current.utterance.onend = null;
    current.utterance.onerror = null;
    current.utterance.onstart = null;
    window.speechSynthesis?.cancel();
    current.reject(new DOMException('Reply playback cancelled', 'AbortError'));
  }, []);
  useEffect(() => cancelReply, [cancelReply]);
  const playReply = useCallback((text: string) => new Promise<void>((resolve, reject) => {
    cancelReply();
    dispatch(setSpokenText(text));
    const engine = window.speechSynthesis;
    if (!engine || typeof SpeechSynthesisUtterance === 'undefined') {
      dispatch(setVoiceError('The teacher reply is available as text; speech is unavailable.'));
      resolve();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = selectSpeechVoice(engine.getVoices(), selectedVoice, new Set(), document.documentElement.lang || navigator.language);
    if (voice) { utterance.voice = voice; utterance.lang = voice.lang; }
    utterance.volume = 1;
    const settle = (error?: Error) => {
      if (active.current?.utterance !== utterance) return;
      clearTimeout(active.current.timer);
      active.current = null;
      dispatch(setIsPlaying(false));
      if (error) {
        dispatch(setVoiceError('The teacher reply could not be spoken. Its text is shown on the board.'));
        resolve();
      } else resolve();
    };
    const timer = setTimeout(() => {
      settle(new Error('Reply speech did not start'));
      engine.cancel();
    }, SPEECH_START_TIMEOUT_MS);
    active.current = { utterance, reject, timer };
    utterance.onstart = () => {
      if (active.current?.utterance !== utterance) return;
      clearTimeout(timer);
      dispatch(setVoiceError(null));
      active.current.timer = setTimeout(() => {
        settle(new Error('Reply speech timed out'));
        engine.cancel();
      }, DISCUSSION_REPLY_AUDIO_TIMEOUT_MS);
    };
    utterance.onend = () => settle();
    utterance.onerror = () => settle(new Error('Reply speech failed'));
    dispatch(setIsPlaying(true));
    try { engine.speak(utterance); } catch { settle(new Error('Reply speech failed')); }
  }), [cancelReply, dispatch, selectedVoice]);
  return { playReply, cancelReply };
}
