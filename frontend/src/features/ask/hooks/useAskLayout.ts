import { useAuthStore } from '@/features/auth/state/authStore';
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';
import type { AskView } from '../types/ask.types';
import { useState, useRef, useEffect, useCallback } from 'react';
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

  const user = useAuthStore((state) => state.user);
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Student';
  const userInitials = userName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const { registeredCourses, isLoading: coursesLoading, error: coursesError } = useDashboardData();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeView, setActiveView] = useState<AskView>('active');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const handleNavigate = useCallback((id: string) => {
    if (id === 'active' || id === 'history' || id === 'paths') {
      setActiveView(id);
      if (window.matchMedia('(max-width: 1023px)').matches) setDrawerOpen(false);
    }
  }, []);
  const handleReturnToChat = useCallback(() => setActiveView('active'), []);
  const handleOpenSettings = useCallback(() => setIsSettingsOpen(true), []);
  const handleCloseSettings = useCallback(() => setIsSettingsOpen(false), []);

  const [input, setInput] = useState('');
  const { isListening, startListening, stopListening } = useVoiceInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleCloseDrawer = useCallback(() => setDrawerOpen(false), []);
  const handleOpenDrawer = useCallback(() => setDrawerOpen(true), []);

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
    activeView, handleNavigate, handleReturnToChat,
    isSettingsOpen, handleOpenSettings, handleCloseSettings,
    userName, userInitials, registeredCourses, coursesLoading, coursesError,
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
    handleCloseDrawer,
    handleOpenDrawer,
    isListening,
    messagesEndRef,
    handleSend,
    handleMicClick,
  };
}
