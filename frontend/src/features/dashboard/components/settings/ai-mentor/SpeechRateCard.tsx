'use client';

import { memo } from 'react';
import { Gauge } from 'lucide-react';
import { SPEECH_SPEED_RATES } from '../../../constants/settingsConstants';
import type { SpeechRateCardProps } from '../../../types/settings.types';

export const SpeechRateCard = memo(function SpeechRateCard({
  speechRate,
  onChangeSpeechRate,
  className = '',
}: SpeechRateCardProps) {
  return (
    <div className={`p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
          <Gauge aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-dashboard-text">Speech Speed Rate</h4>
          <p className="text-xs text-dashboard-muted">
            Adjust audio playback speed for AI voice lectures.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 pt-2">
        {SPEECH_SPEED_RATES.map((rate) => {
          const isSelected = speechRate === rate;
          return (
            <button
              key={rate}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChangeSpeechRate(rate)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-dashboard-selected border-dashboard-primary/50 text-dashboard-text font-semibold'
                  : 'bg-dashboard-panel border-dashboard-border text-dashboard-muted hover:text-dashboard-text'
              }`}
            >
              <div className="text-xs">{rate}x</div>
            </button>
          );
        })}
      </div>
    </div>
  );
});

SpeechRateCard.displayName = 'SpeechRateCard';
