'use client';

import { useState, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setAnswerSubmitting, setInputText, setError, setVoiceError, setPendingQuestion, setChalkboardPoints, setSpokenText, setCurrentChunkIndex } from '@/features/classroom/state/classroomSlice';
import { useClassroomInteraction } from './useClassroomInteraction';
import { useRaisedHand } from './useRaisedHand';
import { useVoiceInput } from './useVoiceInput';
import { useChunkPlayer } from './useChunkPlayer';
import { useClassroomApi } from './useClassroomApi';
import { useDiscussionSubmission } from './useDiscussionSubmission';
import { useLessonAnswerSubmission } from './useLessonAnswerSubmission';

export function useInputBar() {
  const dispatch = useAppDispatch();
  const pendingQuestion = useAppSelector((s) => s.classroom.pendingQuestion);
  const noteId = useAppSelector((s) => s.classroom.noteId);
  const inputText = useAppSelector((s) => s.classroom.inputText);
  const loading = useAppSelector((s) => s.classroom.loading);
  const isPlaying = useAppSelector((s) => s.classroom.isPlaying);
  const { inputBlocked, micBlocked } = useClassroomInteraction();
  const voiceError = useAppSelector((s) => s.classroom.voiceError);
  const chunks = useAppSelector((s) => s.classroom.chunks);

  const { isListening, startListening, stopListening } = useVoiceInput();
  const { sendQuestion } = useClassroomApi();
  const { playFrom, stop, playReply } = useChunkPlayer();

  const [localError, setLocalError] = useState<string | null>(null);
  const { handRaised, handleToggleHand } = useRaisedHand();
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [reactionToast, setReactionToast] = useState<string | null>(null);

  const submittingRef = useRef(false);
  const submitDiscussion = useDiscussionSubmission(noteId);
  const submitLessonAnswer = useLessonAnswerSubmission(noteId);

  const handleSubmit = useCallback(async () => {
    if (!inputText.trim() || inputBlocked || submittingRef.current) return;
    submittingRef.current = true;
    dispatch(setAnswerSubmitting(true));
    if (pendingQuestion?.kind !== 'discussion') stop();
    stopListening();
    setLocalError(null);
    try {
      const answer = inputText.trim();
      if (pendingQuestion?.kind === 'discussion' && noteId) {
        const response = await submitDiscussion(pendingQuestion, answer);
        if (!response) return;
        dispatch(setInputText(''));
        dispatch(setSpokenText(response.reply));
        dispatch(setChalkboardPoints([response.reply]));
        await playReply(response.reply);
      } else if (pendingQuestion && noteId) {
        const evaluation = await submitLessonAnswer(pendingQuestion, answer);
        if (!evaluation) return;
        const canContinue = evaluation.next_action === 'continue';
        dispatch(setPendingQuestion(canContinue ? null : pendingQuestion));
        dispatch(setCurrentChunkIndex(pendingQuestion.sectionIndex + (canContinue ? 1 : 0)));
        dispatch(setSpokenText(evaluation.feedback));
        dispatch(setChalkboardPoints([evaluation.feedback]));
        dispatch(setInputText(''));
        if (canContinue) playFrom(pendingQuestion.sectionIndex + 1);
      } else {
        await sendQuestion(answer);
      }
    } catch (error) {
      if (error instanceof Error && ['AbortError', 'CanceledError'].includes(error.name)) return;
      if (pendingQuestion?.kind === 'discussion') {
        const message = error instanceof Error ? error.message : 'Your question could not be answered right now.';
        dispatch(setSpokenText(message));
        dispatch(setChalkboardPoints([message]));
      }
      setLocalError(error instanceof Error ? error.message : 'Unable to save your answer. Please retry.');
    } finally {
      submittingRef.current = false;
      dispatch(setAnswerSubmitting(false));
    }
  }, [inputText, inputBlocked, sendQuestion, stopListening, pendingQuestion, noteId, stop, dispatch, submitLessonAnswer, playFrom, submitDiscussion, playReply]);

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
    else if (!micBlocked) startListening();
  }, [isListening, micBlocked, startListening, stopListening]);

  const handleSendReaction = useCallback((emoji: string, label: string) => {
    setShowEmojiPicker(false);
    setReactionToast(`${emoji} You reacted with ${label}`);
    setTimeout(() => setReactionToast(null), 3000);
  }, []);

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
    inputBlocked,
    micBlocked,
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
    clearErrors,
    updateInputText,
  };
}
