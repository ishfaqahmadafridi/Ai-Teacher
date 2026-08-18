'use client';

import { memo } from 'react';
import { Volume2 } from 'lucide-react';
import type { VoiceStreamingCardProps } from '../../../types/settings.types';

export const VoiceStreamingCard = memo(function VoiceStreamingCard({
  voiceStreaming,
  onToggleVoiceStreaming,
  className = '',
}: VoiceStreamingCardProps) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
          <Volume2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">AI Voice Audio Streaming</h4>
          <p className="text-xs text-[#94A3B8]">
            Stream real-time voice lectures during Ask Prof. Gemini sessions.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggleVoiceStreaming}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          voiceStreaming ? 'bg-[#2563EB]' : 'bg-[#1E293B]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            voiceStreaming ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
});

VoiceStreamingCard.displayName = 'VoiceStreamingCard';
