'use client';

import { useAppSelector } from '@/hooks/useAppStore';
import { useInputBar } from './useInputBar';

export function useInputBarDockContainer() {
  const topic = useAppSelector((s) => s.classroom.topic);
  const {
    inputText,
    loading,
    inputBlocked,
    micBlocked,
    isPlaying,
    isListening,
    handRaised,
    showEmojiPicker,
    setShowEmojiPicker,
    handleSubmit,
    handleKeyDown,
    handleMicClick,
    handleToggleHand,
    handleSendReaction,
    updateInputText,
  } = useInputBar();

  return {
    topic,

    inputText,
    loading,
    inputBlocked,
    micBlocked,
    isPlaying,
    isListening,
    handRaised,
    showEmojiPicker,
    setShowEmojiPicker,
    handleSubmit,
    handleKeyDown,
    handleMicClick,
    handleToggleHand,
    handleSendReaction,
    updateInputText,
  };
}
