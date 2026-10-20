'use client';
import { useCallback, useRef, useEffect } from 'react';
import { AskService } from '../services/askService';
import { useAuthStore } from '@/features/auth/state/authStore';
import { useConversationSession } from '@/shared/hooks/useConversationSession';
import { v4 as uuidv4 } from 'uuid';
import { useAskStore } from '@/features/ask/state/askStore';
import { useAppSelector } from '@/hooks/useAppStore';

export function useAskSession() {
  const getSessionId = useConversationSession();
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => {
    request.current?.abort();
    useAskStore.getState().setLoading(false);
  }, []);
  const {
    messages,
    loading,
    error,
    speakingId,
    addMessage,
    updateMessage,
    setLoading,
    setError,
    setSpeakingId,
    clearChat,
  } = useAskStore();

  const selectedVoice = useAppSelector((s) => s.classroom.selectedVoice);
  const voices = useAppSelector((s) => s.classroom.voices);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      request.current?.abort();
      const controller = new AbortController();
      request.current = controller;

      const userMsgId = uuidv4();
      addMessage({ id: userMsgId, role: 'user', content: text });
      setLoading(true);
      setError(null);

      try {
        const account = useAuthStore.getState();
        const assistantMsgId = uuidv4();
        let content = '';
        await AskService.streamQuestion({
          question: text, sessionId: getSessionId(), accessToken: account.accessToken || '', signal: controller.signal,
          onToken: (token) => {
            if (controller.signal.aborted) return;
            if (useAuthStore.getState().user?.id !== account.user?.id) {
              controller.abort();
              setLoading(false);
              return;
            }
            if (!content) {
              content = token;
              addMessage({ id: assistantMsgId, role: 'assistant', content });
            } else {
              content += token;
              updateMessage(assistantMsgId, content);
            }
          },
        });
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'An error occurred.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [addMessage, setLoading, setError, updateMessage, getSessionId]
  );

  const speakMessage = useCallback(
    (id: string, content: string) => {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }

      window.speechSynthesis.cancel();
      setSpeakingId(id);

      const utterance = new SpeechSynthesisUtterance(content);
      const voice = voices.find((v) => v.voiceURI === selectedVoice);
      if (voice) {
        const svVoice = window.speechSynthesis
          .getVoices()
          .find((v2) => v2.voiceURI === voice.voiceURI);
        if (svVoice) utterance.voice = svVoice;
      }

      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      window.speechSynthesis.speak(utterance);
    },
    [speakingId, voices, selectedVoice, setSpeakingId]
  );

  return {
    messages,
    loading,
    error,
    speakingId,
    sendMessage,
    speakMessage,
    clearChat,
  };
}
