'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppStore';
import { setVoices } from '@/features/classroom/state/classroomSlice';
import type { SerializedVoice } from '@/types';

export function useVoiceLoader() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!window.speechSynthesis) return;
    const load = () => {
      const svVoices = window.speechSynthesis.getVoices();
      const voices: SerializedVoice[] = svVoices.map((v) => ({
        name: v.name,
        voiceURI: v.voiceURI,
        lang: v.lang,
        localService: v.localService,
      }));
      if (voices.length) dispatch(setVoices(voices));
    };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, [dispatch]);

}
