'use client';

import { memo } from 'react';
import { Clock, BookOpen } from 'lucide-react';
import { SHORT_DAYS } from '../../constants/scheduleConstants';
import type { TimetableSuggestionCardProps } from '../../types/schedule.types';

export const TimetableSuggestionCard = memo(
  function TimetableSuggestionCard({
    item,
    className = '',
  }: TimetableSuggestionCardProps) {
    return (
      <div
        className={`p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 hover:border-slate-600 transition-all ${className}`}
      >
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-[10px] font-bold text-purple-300">
            {SHORT_DAYS[item.dayOfWeek]} • {item.dayOfWeek}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <Clock className="w-3 h-3 text-purple-400" />
            {item.timeFormatted}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="text-xs font-semibold text-white truncate">
            {item.subject}
          </span>
        </div>
      </div>
    );
  }
);

TimetableSuggestionCard.displayName = 'TimetableSuggestionCard';
