'use client';

import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore';
import { useCallback } from 'react';
import { setSelectedVoice } from '@/features/classroom/state/classroomSlice';

export function useVoiceSelector() {
  const dispatch = useAppDispatch();
  const voices = useAppSelector((s) => s.classroom.voices);
  const selectedVoice = useAppSelector((s) => s.classroom.selectedVoice);

  const handleVoiceChange = useCallback(
    (voiceURI: string) => {
      dispatch(setSelectedVoice(voiceURI));
    },
    [dispatch]
  );

  return { voices, selectedVoice, handleVoiceChange };
}
