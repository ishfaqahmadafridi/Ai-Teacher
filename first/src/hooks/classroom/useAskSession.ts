import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import {
  appendMessage,
  setInput,
  setLoading,
  setError,
  setAutoSpeak,
  setSelectedVoice,
  clearChat,
} from '../../redux/askSlice';
import type { AskMessage, AskVoice } from '../../types/classroom/classroom.types';
import { genId, stripForSpeech } from '../../utils/askUtils';
import apiClient from '../../utils/apiClient';

export function useAskSession() {
  const dispatch = useAppDispatch();
  const sessionId = useRef(`session-${genId()}`);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Selector state
  const { messages, input, loading, error, autoSpeak, selectedVoice } =
    useAppSelector((state) => state.ask);

  // Playback state
  const [voices, setVoices] = useState<AskVoice[]>([]);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // -- Load voices ------------------------------------------------------------
  useEffect(() => {
    const synth = window.speechSynthesis;
    const load = () => {
      const v = synth.getVoices();
      const mapped = v.map((x) => ({ name: x.name, lang: x.lang, uri: x.voiceURI }));
      setVoices(mapped);
      if (mapped.length > 0 && !selectedVoice) {
        dispatch(setSelectedVoice(mapped[0].uri ?? mapped[0].name));
      }
    };
    load();
    synth.onvoiceschanged = load;
    return () => {
      synth.onvoiceschanged = null;
    };
  }, [dispatch, selectedVoice]);

  // -- Auto-scroll ------------------------------------------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // -- Auto-speak new assistant messages -------------------------------------
  useEffect(() => {
    if (!autoSpeak || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role === 'assistant') {
      startSpeak(last.id, last.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // -- TTS controls -----------------------------------------------------------
  const startSpeak = useCallback(
    (id: string, content: string) => {
      const synth = window.speechSynthesis;
      synth.cancel();
      const clean = stripForSpeech(content);
      const u = new SpeechSynthesisUtterance(clean);
      const all = synth.getVoices();
      const found = all.find((v) => v.voiceURI === selectedVoice || v.name === selectedVoice);
      if (found) u.voice = found;
      u.lang = found?.lang ?? 'en-US';
      u.rate = 0.95;
      u.pitch = 1.05;
      u.onstart = () => setSpeakingId(id);
      u.onend = () => setSpeakingId(null);
      u.onerror = () => setSpeakingId(null);
      synth.speak(u);
    },
    [selectedVoice]
  );

  const stopSpeak = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, []);

  const toggleSpeak = useCallback(
    (id: string, content: string) => {
      if (speakingId === id) {
        stopSpeak();
        return;
      }
      stopSpeak();
      startSpeak(id, content);
    },
    [speakingId, startSpeak, stopSpeak]
  );

  // -- Text area utilities ----------------------------------------------------
  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  // -- API interactions -------------------------------------------------------
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      dispatch(setError(null));

      const userMsg: AskMessage = { id: genId(), role: 'user', content: text.trim() };
      dispatch(appendMessage(userMsg));
      dispatch(setInput(''));

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      dispatch(setLoading(true));

      try {
        const res = await apiClient.post('/ask/', {
          question: userMsg.content,
          session_id: sessionId.current,
        });
        dispatch(
          appendMessage({
            id: genId(),
            role: 'assistant',
            content: res.data.answer ?? JSON.stringify(res.data),
          })
        );
      } catch (err: any) {
        dispatch(setError(err?.response?.data?.error ?? err.message ?? 'Request failed'));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, loading]
  );

  const handleNewChat = useCallback(async () => {
    stopSpeak();
    dispatch(clearChat());
    try {
      await apiClient.post('/clear/', { session_id: sessionId.current });
    } catch {}
    sessionId.current = `session-${genId()}`;
  }, [dispatch, stopSpeak]);

  return {
    messages,
    input,
    setInput: (val: string) => dispatch(setInput(val)),
    loading,
    error,
    autoSpeak,
    setAutoSpeak: (checked: boolean) => dispatch(setAutoSpeak(checked)),
    selectedVoice,
    setSelectedVoice: (voice: string) => dispatch(setSelectedVoice(voice)),
    voices,
    speakingId,
    toggleSpeak,
    sendMessage,
    handleNewChat,
    bottomRef,
    textareaRef,
    resizeTextarea,
  };
}
