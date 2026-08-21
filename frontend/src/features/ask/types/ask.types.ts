import type { RefObject, KeyboardEvent, ChangeEvent } from 'react';

export type AskRole = 'user' | 'assistant';

export interface AskMessage {
  id: string;
  role: AskRole;
  content: string;
}

// ─── Header Props ─────────────────────────────────────────────────────────────
export interface AskHeaderProps {
  drawerOpen: boolean;
  onOpenDrawer: () => void;
  className?: string;
}

// ─── Sidebar Props ────────────────────────────────────────────────────────────
export interface AskSidebarProps {
  drawerOpen: boolean;
  onClose: () => void;
  className?: string;
}

export interface SidebarUserProfileProps {
  name?: string;
  rank?: string;
  initials?: string;
  onClose?: () => void;
  className?: string;
}

export interface SidebarNavItem {
  id: string;
  label: string;
  iconName: 'chat' | 'history' | 'paths' | 'settings';
  isActive?: boolean;
}

export interface SidebarNavItemProps {
  item: SidebarNavItem;
  onClick?: (id: string) => void;
  className?: string;
}

export interface SidebarNavIconProps {
  iconName: SidebarNavItem['iconName'];
  className?: string;
}

// ─── Message & Chat Props ────────────────────────────────────────────────────
export interface AskMessageItemProps {
  msg: AskMessage;
  speakingId: string | null;
  onSpeak: (id: string, text: string) => void;
  className?: string;
}

export interface AskMessageListProps {
  messages: AskMessage[];
  loading: boolean;
  error: string | null;
  speakingId: string | null;
  onSpeak: (id: string, text: string) => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  className?: string;
}

export interface AskEmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export interface AskTypingIndicatorProps {
  text?: string;
  className?: string;
}

// ─── Input & Controls Props ──────────────────────────────────────────────────
export interface AskInputFooterProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  isListening: boolean;
  onMicClick: () => void;
  className?: string;
}

export interface AttachmentMenuProps {
  isOpen: boolean;
  menuRef: RefObject<HTMLDivElement | null>;
  onSelectImage: () => void;
  onSelectDoc: () => void;
  className?: string;
}

export interface AttachmentBadgeProps {
  fileName: string;
  onRemove: () => void;
  className?: string;
}

export interface VoiceMicButtonProps {
  isListening: boolean;
  onClick: () => void;
  className?: string;
}

export interface SendButtonProps {
  disabled: boolean;
  onClick: () => void;
  className?: string;
}

// ─── Hook Return Interfaces ──────────────────────────────────────────────────
export interface UseAskInputFooterOptions {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
}

export interface UseAskInputFooterReturn {
  menuOpen: boolean;
  attachedFile: File | null;
  menuRef: RefObject<HTMLDivElement | null>;
  imageInputRef: RefObject<HTMLInputElement | null>;
  docInputRef: RefObject<HTMLInputElement | null>;
  toggleMenu: () => void;
  removeAttachment: () => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSendWithAttachment: () => void;
  triggerImageUpload: () => void;
  triggerDocUpload: () => void;
}
