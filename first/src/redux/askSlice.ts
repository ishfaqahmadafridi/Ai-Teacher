import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AskMessage } from '../types/classroom/classroom.types';

export interface AskState {
  messages: AskMessage[];
  input: string;
  loading: boolean;
  error: string | null;
  autoSpeak: boolean;
  selectedVoice: string | null;
}

const initialState: AskState = {
  messages: [],
  input: '',
  loading: false,
  error: null,
  autoSpeak: false,
  selectedVoice: null,
};

export const askSlice = createSlice({
  name: 'ask',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<AskMessage[]>) => {
      state.messages = action.payload;
    },
    appendMessage: (state, action: PayloadAction<AskMessage>) => {
      state.messages.push(action.payload);
    },
    setInput: (state, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAutoSpeak: (state, action: PayloadAction<boolean>) => {
      state.autoSpeak = action.payload;
    },
    setSelectedVoice: (state, action: PayloadAction<string | null>) => {
      state.selectedVoice = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
      state.input = '';
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setMessages,
  appendMessage,
  setInput,
  setLoading,
  setError,
  setAutoSpeak,
  setSelectedVoice,
  clearChat,
} = askSlice.actions;

export default askSlice.reducer;
