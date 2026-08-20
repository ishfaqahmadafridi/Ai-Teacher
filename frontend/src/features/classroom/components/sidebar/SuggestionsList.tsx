'use client';

import { memo } from 'react';
import { ASK_SUGGESTIONS } from '@/lib/constants';
import type { SuggestionsListProps } from '../../types/sidebar.types';

export const SuggestionsList = memo(function SuggestionsList({ onAsk, loading, isPlaying }: SuggestionsListProps) {
  const disabled = loading || isPlaying;
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
        💡 Suggestions
      </p>
      {ASK_SUGGESTIONS.map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => onAsk(s)}
          className="text-left text-sm text-slate-300 hover:text-white hover:bg-slate-700/60 px-3 py-2 rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed border border-transparent hover:border-slate-600"
        >
          {s}
        </button>
      ))}
    </div>
  );
});

SuggestionsList.displayName = 'SuggestionsList';
