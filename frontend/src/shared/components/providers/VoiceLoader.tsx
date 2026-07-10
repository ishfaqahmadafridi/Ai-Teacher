'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppStore';
import { setVoices } from '@/features/classroom/state/classroomSlice';
import type { SerializedVoice } from '@/types';

export function VoiceLoader() {
  const dispatch = useAppDispatch();

  useEffect(() => {
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
    window.speechSynthesis.onvoiceschanged = load;
  }, [dispatch]);

  return null;
}
