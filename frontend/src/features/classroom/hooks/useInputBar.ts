'use client';

import { useState, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setInputText, setError, setVoiceError, setChunks, setPendingQuestion, setChalkboardPoints } from '@/features/classroom/state/classroomSlice';
import { useVoiceInput } from './useVoiceInput';
import { useChunkPlayer } from './useChunkPlayer';
import { useClassroomApi } from './useClassroomApi';
import { lectureNotesService } from '../services/lectureNotesService';

export function useInputBar() {
  const dispatch = useAppDispatch();
  const pendingQuestion = useAppSelector((s) => s.classroom.pendingQuestion);
  const noteId = useAppSelector((s) => s.classroom.noteId);
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

  const submittingRef = useRef(false);
  const answerRequestRef = useRef<{ key: string; id: string } | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!inputText.trim() || loading || submittingRef.current) return;
    submittingRef.current = true;
    stop();
    stopListening();
    setLocalError(null);
    try {
      const answer = inputText.trim();
      if (pendingQuestion && noteId) {
        const key = JSON.stringify([noteId, pendingQuestion.sectionIndex, answer]);
        if (answerRequestRef.current?.key !== key) answerRequestRef.current = { key, id: crypto.randomUUID() };
        const attempt = await lectureNotesService.answer(noteId, pendingQuestion.sectionIndex, answer, answerRequestRef.current.id);
        const evaluation = await lectureNotesService.evaluate(noteId, attempt.id);
        dispatch(setPendingQuestion(null));
        dispatch(setChalkboardPoints([]));
        dispatch(setChunks([{ speak: evaluation.feedback, key_point: evaluation.missing_concepts.join('; ') || null }]));
        answerRequestRef.current = null;
      } else {
        await sendQuestion(answer);
      }
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Unable to save your answer. Please retry.');
    } finally {
      submittingRef.current = false;
    }
  }, [inputText, loading, sendQuestion, stopListening, pendingQuestion, noteId, stop, dispatch]);

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
    else if (!loading) { pause(); startListening(); }
  }, [isListening, loading, startListening, stopListening, pause]);

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
    dispatch(setVoiceError(null));
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
