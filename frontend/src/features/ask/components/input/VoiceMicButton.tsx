'use client';

import { memo } from 'react';
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
      onClick={onClick}
      className={`p-2.5 rounded-full transition-all duration-200 shrink-0 border-none cursor-pointer flex items-center justify-center ${
        isListening
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
      } ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
      </svg>
    </Button>
  );
});

VoiceMicButton.displayName = 'VoiceMicButton';
