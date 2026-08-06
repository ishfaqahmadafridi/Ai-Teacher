'use client';

import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setInputText } from '@/features/classroom/state/classroomSlice';
import { useVoiceInput } from './useVoiceInput';
import { useClassroomApi } from './useClassroomApi';

/**
 * Custom Hook encapsulating state management, dispatchers, voice recognition,
 * and interaction handlers for FloatingInteractionBar component.
 */
export function useFloatingInteractionBar() {
  const dispatch = useAppDispatch();
  const inputText = useAppSelector((s) => s.classroom.inputText);
  const loading = useAppSelector((s) => s.classroom.loading);
  const isPlaying = useAppSelector((s) => s.classroom.isPlaying);

  const { isListening, startListening, stopListening } = useVoiceInput();
  const { sendQuestion } = useClassroomApi();

  const [isHandRaised, setIsHandRaised] = useState(false);

  const handleInputChange = useCallback(
    (val: string) => {
      dispatch(setInputText(val));
    },
    [dispatch]
  );

  const handleSubmitQuestion = useCallback(async () => {
    if (!inputText.trim()) return;
    await sendQuestion(inputText.trim());
  }, [inputText, sendQuestion]);

  const handleToggleRaiseHand = useCallback(() => {
    setIsHandRaised((prev) => !prev);
  }, []);

  const handleToggleMic = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    inputText,
    loading,
    isPlaying,
    isListening,
    isHandRaised,
    handleInputChange,
    handleSubmitQuestion,
    handleToggleRaiseHand,
    handleToggleMic,
  };
}
