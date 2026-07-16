// ─── Ask session state (Zustand) ─────────────────────────────────────────────
// The /ask chat page has its own isolated state.
// It doesn't need Redux — only the AskLayout page uses it.

import { create } from 'zustand';
import type { AskMessage } from '../types/ask.types';

interface AskState {
  messages: AskMessage[];
  loading: boolean;
  error: string | null;
  speakingId: string | null;

  addMessage: (msg: AskMessage) => void;
  setMessages: (msgs: AskMessage[]) => void;
  setLoading: (v: boolean) => void;
  setError: (err: string | null) => void;
  setSpeakingId: (id: string | null) => void;
  clearChat: () => void;
}

export const useAskStore = create<AskState>((set) => ({
  messages: [],
  loading: false,
  error: null,
  speakingId: null,

  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setMessages: (messages) => set({ messages }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSpeakingId: (speakingId) => set({ speakingId }),
  clearChat: () => set({ messages: [], error: null, speakingId: null }),
}));
