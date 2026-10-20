'use client';

import { memo } from 'react';
import { GraduationCap } from 'lucide-react';
import { AI_PROFESSOR_AVATARS } from '../../../constants/settingsConstants';
import type { AIAvatarModelCardProps } from '../../../types/settings.types';

export const AIAvatarModelCard = memo(function AIAvatarModelCard({
  aiAvatarModel,
  onChangeModel,
  className = '',
}: AIAvatarModelCardProps) {
  return (
    <div className={`p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
          <GraduationCap aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-dashboard-text">AI Professor Avatar Model</h4>
          <p className="text-xs text-dashboard-muted">
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
              aria-pressed={isSelected}
              onClick={() => onChangeModel(model.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-dashboard-selected border-dashboard-primary/50 text-dashboard-text font-semibold'
                  : 'bg-dashboard-panel border-dashboard-border text-dashboard-muted hover:text-dashboard-text'
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
