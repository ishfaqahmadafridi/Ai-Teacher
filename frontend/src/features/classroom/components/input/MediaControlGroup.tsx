'use client';

import { memo } from 'react';
import { Mic, MicOff } from 'lucide-react';
import type { MediaControlGroupProps } from '../../types/input.types';

export const MediaControlGroup = memo(function MediaControlGroup({
  isMicOn = false,
  isListening = false,
  onToggleMic,
  className = '',
}: MediaControlGroupProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Microphone Toggle Only */}
      <button
        type="button"
        onClick={onToggleMic}
        aria-label={isMicOn || isListening ? 'Mute Microphone' : 'Unmute Microphone'}
        aria-pressed={isMicOn || isListening}
        className={`flex flex-col items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-[#e2e2e8] group relative cursor-pointer ${
          isListening ? 'border-[#ff5252]/60 bg-[#ff5252]/10 animate-pulse' : ''
        }`}
      >
        <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/20 transition-all" aria-hidden="true" />
        {isMicOn || isListening ? (
          <Mic className="w-4 h-4 md:w-4.5 md:h-4.5 mb-0.5 relative z-10 text-[#4edea3]" aria-hidden="true" />
        ) : (
          <MicOff className="w-4 h-4 md:w-4.5 md:h-4.5 mb-0.5 relative z-10 text-[#c4c5d9]" aria-hidden="true" />
        )}
        <span className="text-[8px] uppercase tracking-wider font-semibold opacity-75 leading-none">
          {isListening ? 'Rec' : isMicOn ? 'On' : 'Mic'}
        </span>
      </button>
    </div>
  );
});

MediaControlGroup.displayName = 'MediaControlGroup';

