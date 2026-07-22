import { useState, useRef, useEffect } from 'react';
import { useAskSession } from './useAskSession';
import { useVoiceInput } from '@/features/classroom/hooks/useVoiceInput';

export function useAskLayout() {
  const {
    messages,
    loading,
    error,
    speakingId,
    sendMessage,
    speakMessage,
    clearChat,
  } = useAskSession();

  const [input, setInput] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(true);
  const { isListening, startListening, stopListening } = useVoiceInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleMicClick = () => {
    if (isListening) stopListening();
    else startListening();
  };

  return {
    messages,
    loading,
    error,
    speakingId,
    speakMessage,
    clearChat,
    input,
    setInput,
    drawerOpen,
    setDrawerOpen,
    isListening,
    messagesEndRef,
    handleSend,
    handleMicClick,
  };
}
