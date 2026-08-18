'use client';

import { memo } from 'react';
import { Mic } from 'lucide-react';
import { SPEECH_SPEED_RATES } from '../../../constants/settingsConstants';
import type { SpeechRateCardProps } from '../../../types/settings.types';

export const SpeechRateCard = memo(function SpeechRateCard({
  speechRate,
  onChangeSpeechRate,
  className = '',
}: SpeechRateCardProps) {
  return (
    <div className={`p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#C4B5FD] shrink-0">
          <Mic className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Speech Speed Rate</h4>
          <p className="text-xs text-[#94A3B8]">
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
              onClick={() => onChangeSpeechRate(rate)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#8B5CF6]/20 border-[#C4B5FD] text-white font-bold'
                  : 'bg-[#070D1A] border-[#1E293B] text-[#94A3B8] hover:text-white'
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
