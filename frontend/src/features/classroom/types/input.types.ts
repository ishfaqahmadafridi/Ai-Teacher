export interface RaiseHandButtonProps {
  handRaised?: boolean;
  isHandRaised?: boolean;
  onToggleHand?: () => void;
  onToggleRaiseHand?: () => void;
  className?: string;
}

export interface QuestionInputFieldProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export interface MediaControlGroupProps {
  isMicOn?: boolean;
  isListening?: boolean;
  onToggleMic?: () => void;
  className?: string;
}

export interface FloatingInteractionBarProps {
  onAskQuestion?: (question: string) => void;
  className?: string;
}

export interface LeaveClassButtonProps {
  className?: string;
}

export interface EmojiReactionPopoverProps {
  showEmojiPicker: boolean;
  onTogglePicker: () => void;
  onSendReaction: (emoji: string, label: string) => void;
  className?: string;
}

export interface QuestionTextInputProps {
  inputText: string;
  onChange: (text: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  className?: string;
}

export interface VoiceMicButtonProps {
  isListening: boolean;
  onMicClick: () => void;
  className?: string;
}

export interface SubmitAskButtonProps {
  loading: boolean;
  disabled: boolean;
  onSubmit: () => void;
  className?: string;
}

export interface PlaybackControlsRowProps {
  chunksLength: number;
  isPlaying: boolean;
  isPaused: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  className?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  role: 'teacher' | 'student' | 'system';
  text: string;
  timestamp: string;
}

export interface ClassroomChatInboxPopoverProps {
  className?: string;
}

export interface ChatMessageItemRowProps {
  msg: ChatMessage;
}

export interface ChatMessageListProps {
  messages: ChatMessage[];
  className?: string;
}

export interface ChatInputBarProps {
  inputMsg: string;
  onChange: (val: string) => void;
  onSend: () => void;
  className?: string;
}

export interface ChatInboxHeaderProps {
  onClose: () => void;
  className?: string;
}

export interface ChatInboxTriggerButtonProps {
  isOpen: boolean;
  messageCount: number;
  onToggle: () => void;
  className?: string;
}
