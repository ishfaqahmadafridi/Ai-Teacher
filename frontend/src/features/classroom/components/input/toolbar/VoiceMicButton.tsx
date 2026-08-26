'use client';

import { memo } from 'react';
import { Mic, MicOff } from 'lucide-react';
import type { VoiceMicButtonProps } from '../../../types/input.types';

export const VoiceMicButton = memo(function VoiceMicButton({
  isListening,
  onMicClick,
  className = '',
}: VoiceMicButtonProps) {
  return (
    <button
      id="mic-btn"
      type="button"
      onClick={onMicClick}
      title={isListening ? 'Mute Microphone' : 'Unmute Microphone'}
      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm ${
        isListening
          ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
          : 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:text-white'
      } ${className}`}
    >
      {isListening ? (
        <>
          <Mic className="w-4 h-4 text-red-400" />
          <span>Mute</span>
        </>
      ) : (
        <>
          <MicOff className="w-4 h-4 text-slate-400" />
          <span>Mic</span>
        </>
      )}
    </button>
  );
});

VoiceMicButton.displayName = 'VoiceMicButton';
