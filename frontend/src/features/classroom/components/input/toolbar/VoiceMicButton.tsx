'use client';

import { memo } from 'react';
import { Mic, MicOff } from 'lucide-react';
import type { VoiceMicButtonProps } from '../../../types/input.types';

export const VoiceMicButton = memo(function VoiceMicButton({
  disabled = false,
  isListening,
  onMicClick,
  className = '',
}: VoiceMicButtonProps) {
  return (
    <button
      id="mic-btn"
      type="button"
      onClick={onMicClick}
      disabled={disabled}
      aria-pressed={isListening}
      title={isListening ? 'Mute Microphone' : 'Unmute Microphone'}
      className={`min-h-11 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashboard-primary transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm ${
        isListening
          ? 'bg-red-500/20 text-dashboard-danger border border-red-500/40 animate-pulse'
          : 'bg-dashboard-subtle hover:bg-dashboard-selected text-dashboard-text border border-dashboard-border hover:text-dashboard-primary'
      } ${className}`}
    >
      {isListening ? (
        <>
          <Mic className="w-4 h-4 text-red-400" />
          <span>Mute</span>
        </>
      ) : (
        <>
          <MicOff className="w-4 h-4 text-dashboard-muted" />
          <span>Mic</span>
        </>
      )}
    </button>
  );
});

VoiceMicButton.displayName = 'VoiceMicButton';
