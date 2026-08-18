'use client';

import { memo } from 'react';
import { Sparkles } from 'lucide-react';
import { EXPLANATION_DEPTH_LEVELS } from '../../../constants/settingsConstants';
import type { ExplanationDepthCardProps } from '../../../types/settings.types';

export const ExplanationDepthCard = memo(function ExplanationDepthCard({
  explanationDepth,
  onChangeDepth,
  className = '',
}: ExplanationDepthCardProps) {
  return (
    <div className={`p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#C4B5FD] shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Lecture Explanation Depth</h4>
          <p className="text-xs text-[#94A3B8]">
            Adjust how detailed AI Prof. Gemini formats explanations and formulas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {EXPLANATION_DEPTH_LEVELS.map((level) => {
          const isSelected = explanationDepth === level.id;
          return (
            <button
              key={level.id}
              type="button"
              onClick={() => onChangeDepth(level.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#2563EB]/20 border-[#38BDF8] text-white font-bold'
                  : 'bg-[#070D1A] border-[#1E293B] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-bold text-xs">{level.title}</div>
              <div className="text-[11px] opacity-80 mt-0.5">{level.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
});

ExplanationDepthCard.displayName = 'ExplanationDepthCard';
