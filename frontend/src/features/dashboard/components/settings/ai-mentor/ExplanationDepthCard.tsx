'use client';

import { memo } from 'react';
import { ListTree } from 'lucide-react';
import { EXPLANATION_DEPTH_LEVELS } from '../../../constants/settingsConstants';
import type { ExplanationDepthCardProps } from '../../../types/settings.types';

export const ExplanationDepthCard = memo(function ExplanationDepthCard({
  explanationDepth,
  onChangeDepth,
  className = '',
}: ExplanationDepthCardProps) {
  return (
    <div className={`p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
          <ListTree aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-dashboard-text">Lecture Explanation Depth</h4>
          <p className="text-xs text-dashboard-muted">
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
              aria-pressed={isSelected}
              onClick={() => onChangeDepth(level.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-dashboard-selected border-dashboard-primary/50 text-dashboard-text font-semibold'
                  : 'bg-dashboard-panel border-dashboard-border text-dashboard-muted hover:text-dashboard-text'
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
