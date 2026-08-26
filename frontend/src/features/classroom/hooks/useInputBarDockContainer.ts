'use client';

import { useInputBar } from './useInputBar';

export function useInputBarDockContainer() {
  const {
    inputText,
    loading,
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
    inputText,
    loading,
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
