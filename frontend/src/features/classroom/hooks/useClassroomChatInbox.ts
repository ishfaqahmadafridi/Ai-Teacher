'use client';

import { useState, useCallback } from 'react';
import { DEFAULT_CHAT_MESSAGES } from '../constants/sidebarConstants';
import type { ChatMessage } from '../types/input.types';

export function useClassroomChatInbox() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_CHAT_MESSAGES);
  const [inputMsg, setInputMsg] = useState<string>('');

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!inputMsg.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'You (Student)',
      role: 'student',
      text: inputMsg.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
  }, [inputMsg]);

  return {
    isOpen,
    messages,
    inputMsg,
    toggleOpen,
    setInputMsg,
    handleSendMessage,
  };
}
