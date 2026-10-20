'use client';

import { memo } from 'react';
import { Mic } from 'lucide-react';
import { Button } from '../ui';
import type { VoiceMicButtonProps } from '../../types/ask.types';

export const VoiceMicButton = memo(function VoiceMicButton({
  isListening,
  onClick,
  className = '',
}: VoiceMicButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={isListening ? 'Stop recording' : 'Start voice input'}
      onClick={onClick}
      className={`size-10 p-0 rounded-full transition-all duration-200 shrink-0 border-none cursor-pointer flex items-center justify-center ${
        isListening
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-dashboard-subtle text-dashboard-muted hover:bg-dashboard-subtle hover:text-dashboard-text'
      } ${className}`}
    >
      <Mic aria-hidden="true" className="size-5" strokeWidth={1.75} />
    </Button>
  );
});

VoiceMicButton.displayName = 'VoiceMicButton';
