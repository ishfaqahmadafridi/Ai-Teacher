import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { setVoices, setSelectedVoice } from '../../redux/classroomSlice';
import type { SerializedVoice } from '../../types/classroom/classroom.types';

function getVoices(): SerializedVoice[] {
  const raw = window.speechSynthesis?.getVoices() ?? [];
  return raw.map(v => ({
    name: v.name,
    voiceURI: v.voiceURI,
    lang: v.lang,
    localService: v.localService,
  }));
}

export function useSpeechVoices() {
  const dispatch = useAppDispatch();
  const voices = useAppSelector(state => state.classroom.voices);
  const selectedVoice = useAppSelector(state => state.classroom.selectedVoice);

  useEffect(() => {
    const load = () => {
      const v = getVoices();
      dispatch(setVoices(v));
      if (v.length > 0 && !selectedVoice) {
        const preferred = v.find(x => x.lang.startsWith('en') && x.localService) ?? v[0];
        dispatch(setSelectedVoice(preferred?.voiceURI ?? preferred?.name ?? ''));
      }
    };
    load();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = load;
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectedVoice, dispatch]);

  return {
    voices,
    selectedVoice,
    setSelectedVoice: (voice: string) => dispatch(setSelectedVoice(voice)),
  };
}
