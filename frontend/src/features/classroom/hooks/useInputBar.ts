'use client';

import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setInputText, setError } from '@/features/classroom/state/classroomSlice';
import { useVoiceInput } from './useVoiceInput';
import { useChunkPlayer } from './useChunkPlayer';
import { useClassroomApi } from './useClassroomApi';

export function useInputBar() {
  const dispatch = useAppDispatch();
  const inputText = useAppSelector((s) => s.classroom.inputText);
  const loading = useAppSelector((s) => s.classroom.loading);
  const isPlaying = useAppSelector((s) => s.classroom.isPlaying);
  const isPaused = useAppSelector((s) => s.classroom.isPaused);
  const voiceError = useAppSelector((s) => s.classroom.voiceError);
  const chunks = useAppSelector((s) => s.classroom.chunks);

  const { isListening, startListening, stopListening } = useVoiceInput();
  const { sendQuestion } = useClassroomApi();
  const { play, pause, resume, stop } = useChunkPlayer();

  const [localError, setLocalError] = useState<string | null>(null);
  const [handRaised, setHandRaised] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [reactionToast, setReactionToast] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!inputText.trim()) return;
    setLocalError(null);
    await sendQuestion(inputText.trim());
  }, [inputText, sendQuestion]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleMicClick = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  const handleToggleHand = useCallback(() => {
    setHandRaised((prev) => {
      const nextState = !prev;
      setReactionToast(nextState ? '✋ You raised your hand' : 'Lowered hand');
      setTimeout(() => setReactionToast(null), 3000);
      return nextState;
    });
  }, []);

  const handleSendReaction = useCallback((emoji: string, label: string) => {
    setShowEmojiPicker(false);
    setReactionToast(`${emoji} You reacted with ${label}`);
    setTimeout(() => setReactionToast(null), 3000);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!isPlaying && chunks.length > 0) {
      play();
    } else if (isPlaying && !isPaused) {
      pause();
    } else if (isPlaying && isPaused) {
      resume();
    }
  }, [isPlaying, isPaused, chunks.length, play, pause, resume]);

  const clearErrors = useCallback(() => {
    dispatch(setError(null));
    setLocalError(null);
  }, [dispatch]);

  const updateInputText = useCallback(
    (text: string) => {
      dispatch(setInputText(text));
    },
    [dispatch]
  );

  return {
    inputText,
    loading,
    isPlaying,
    isPaused,
    voiceError,
    localError,
    chunks,
    isListening,
    handRaised,
    showEmojiPicker,
    reactionToast,
    setShowEmojiPicker,
    handleSubmit,
    handleKeyDown,
    handleMicClick,
    handleToggleHand,
    handleSendReaction,
    handlePlayPause,
    stop,
    clearErrors,
    updateInputText,
  };
}
