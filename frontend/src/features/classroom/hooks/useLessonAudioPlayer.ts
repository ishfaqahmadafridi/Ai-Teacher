 'use client';
import { useCallback, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api';
import type { LessonAudioCallbacks } from '../types/playback.types';

/** Private WAV transport; browser speech is not involved in playback. */
export function useLessonAudioPlayer() {
  const active = useRef<{ audio: HTMLAudioElement; controller: AbortController; url: string | null } | null>(null);
  const stopAudio = useCallback(() => {
    const current = active.current;
    active.current = null;
    if (!current) return;
    current.controller.abort();
    current.audio.onplaying = null;
    current.audio.onended = null;
    current.audio.onerror = null;
    current.audio.pause();
    current.audio.removeAttribute('src');
    if (current.url) URL.revokeObjectURL(current.url);
  }, []);
  const playAudio = useCallback(async (noteId: string, index: number, text: string, callbacks: LessonAudioCallbacks) => {
    stopAudio();
    const current = { audio: new Audio(), controller: new AbortController(), url: null as string | null };
    active.current = current;
    try {
      const response = await apiClient.post<Blob>(`/api/notes/${noteId}/audio/${index}/`, { speak: text }, {
        responseType: 'blob', signal: current.controller.signal, timeout: 30000,
      });
      if (active.current !== current) return;
      current.url = URL.createObjectURL(response.data);
      current.audio.src = current.url;
      current.audio.onplaying = callbacks.onStart;
      current.audio.onended = () => { stopAudio(); callbacks.onEnd(); };
      current.audio.onerror = () => { stopAudio(); callbacks.onError(); };
      await current.audio.play();
    } catch {
      if (active.current !== current) return;
      stopAudio();
      callbacks.onError();
    }
  }, [stopAudio]);
  const pauseAudio = useCallback(() => active.current?.audio.pause(), []);
  const resumeAudio = useCallback(() => {
    const current = active.current;
    if (current) current.audio.play().catch(() => current.audio.onerror?.(new Event('error')));
  }, []);
  useEffect(() => stopAudio, [stopAudio]);
  return { playAudio, stopAudio, pauseAudio, resumeAudio };
}
