'use client';

import { memo } from 'react';
import { Bot } from 'lucide-react';
import { AI_PROFESSOR_AVATARS } from '../../../constants/settingsConstants';
import type { AIAvatarModelCardProps } from '../../../types/settings.types';

export const AIAvatarModelCard = memo(function AIAvatarModelCard({
  aiAvatarModel,
  onChangeModel,
  className = '',
}: AIAvatarModelCardProps) {
  return (
    <div className={`p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">AI Professor Avatar Model</h4>
          <p className="text-xs text-[#94A3B8]">
            Select primary AI Teacher persona for live classroom lectures.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {AI_PROFESSOR_AVATARS.map((model) => {
          const isSelected = aiAvatarModel === model.id;
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onChangeModel(model.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#2563EB]/20 border-[#38BDF8] text-white font-bold'
                  : 'bg-[#070D1A] border-[#1E293B] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="text-xs">{model.name}</div>
              <div className="text-[11px] opacity-80 mt-0.5">{model.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
});

AIAvatarModelCard.displayName = 'AIAvatarModelCard';
