'use client';

import { memo } from 'react';
import { Check, Edit3 } from 'lucide-react';
import type { TimetableSuggestionReviewFooterProps } from '../../types/schedule.types';

export const TimetableSuggestionReviewFooter = memo(
  function TimetableSuggestionReviewFooter({
    onClose,
    onAccept,
    onCustomize,
    className = '',
  }: TimetableSuggestionReviewFooterProps) {
    return (
      <div
        className={`flex items-center justify-between pt-4 border-t border-slate-800 ${className}`}
      >
        <button
          type="button"
          onClick={onCustomize ?? onClose}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Customize Slots</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onAccept}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Accept Timetable</span>
          </button>
        </div>
      </div>
    );
  }
);

TimetableSuggestionReviewFooter.displayName =
  'TimetableSuggestionReviewFooter';
