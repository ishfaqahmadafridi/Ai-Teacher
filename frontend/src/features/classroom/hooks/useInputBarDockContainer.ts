'use client';

import { useAppSelector } from '@/hooks/useAppStore';
import { useInputBar } from './useInputBar';

export function useInputBarDockContainer() {
  const topic = useAppSelector((s) => s.classroom.topic);
  const hasLecture = useAppSelector((s) => s.classroom.chunks.length > 0);
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
    topic,
    questionNotice: loading ? 'Preparing your answer…' : isPlaying ? 'Listen to the lesson. You can ask a question when it finishes.' : hasLecture ? `Any questions about ${topic || 'this topic'}? Type your question or use Mic, then select Ask. Answers play one step at a time.` : 'Type a question or use Mic, then select Ask.',
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
