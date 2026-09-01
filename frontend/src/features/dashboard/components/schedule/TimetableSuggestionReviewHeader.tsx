'use client';

import { memo } from 'react';
import { Sparkles, X } from 'lucide-react';
import type { TimetableSuggestionReviewHeaderProps } from '../../types/schedule.types';

export const TimetableSuggestionReviewHeader = memo(
  function TimetableSuggestionReviewHeader({
    optimizationSummary,
    onClose,
    className = '',
  }: TimetableSuggestionReviewHeaderProps) {
    return (
      <div
        className={`flex items-start justify-between border-b border-slate-800 pb-4 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Suggested AI Timetable</h3>
            <p className="text-xs text-slate-400">{optimizationSummary}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close suggestion review modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }
);

TimetableSuggestionReviewHeader.displayName = 'TimetableSuggestionReviewHeader';
