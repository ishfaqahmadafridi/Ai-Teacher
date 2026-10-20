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
    <div className={`flex items-center justify-between p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
          <Volume2 aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-dashboard-text">AI Voice Audio Streaming</h4>
          <p className="text-xs text-dashboard-muted">
            Stream real-time voice lectures during Ask Prof. Gemini sessions.
          </p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={voiceStreaming}
        aria-label="AI voice audio streaming"
        onClick={onToggleVoiceStreaming}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-primary focus-visible:ring-offset-2 ${
          voiceStreaming ? 'bg-dashboard-primary' : 'bg-dashboard-subtle'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-none ring-0 transition duration-200 ease-in-out ${
            voiceStreaming ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
});

VoiceStreamingCard.displayName = 'VoiceStreamingCard';
