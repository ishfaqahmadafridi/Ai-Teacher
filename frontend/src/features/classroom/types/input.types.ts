export interface RaiseHandButtonProps {
  isHandRaised?: boolean;
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
