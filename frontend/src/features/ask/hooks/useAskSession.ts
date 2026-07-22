'use client';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAskStore } from '@/features/ask/state/askStore';
import { AskService } from '@/features/ask/services/askService';
import { useAppSelector } from '@/hooks/useAppStore';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';
const SESSION_KEY = 'ai_teacher_session_id';

function getSessionId(): string {
  if (typeof window === 'undefined') return uuidv4();
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function useAskSession() {
  const {
    messages,
    loading,
    error,
    speakingId,
    addMessage,
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

      const userMsgId = uuidv4();
      addMessage({ id: userMsgId, role: 'user', content: text });
      setLoading(true);
      setError(null);

      try {
        const data = await AskService.askQuestion(text, getSessionId());
        const assistantMsgId = uuidv4();
        addMessage({ id: assistantMsgId, role: 'assistant', content: data.answer });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred.');
      } finally {
        setLoading(false);
      }
    },
    [addMessage, setLoading, setError]
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
