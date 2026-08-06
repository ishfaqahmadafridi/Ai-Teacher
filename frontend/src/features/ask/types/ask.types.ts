import { RefObject } from 'react';

export type AskRole = 'user' | 'assistant';

export interface AskMessage {
  id: string;
  role: AskRole;
  content: string;
}

export interface AskHeaderProps {
  drawerOpen: boolean;
  onOpenDrawer: () => void;
}

export interface AskSidebarProps {
  drawerOpen: boolean;
  onClose: () => void;
}

export interface AskMessageItemProps {
  msg: AskMessage;
  speakingId: string | null;
  onSpeak: (id: string, text: string) => void;
}

export interface AskMessageListProps {
  messages: AskMessage[];
  loading: boolean;
  error: string | null;
  speakingId: string | null;
  onSpeak: (id: string, text: string) => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export interface AskInputFooterProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  isListening: boolean;
  onMicClick: () => void;
}
