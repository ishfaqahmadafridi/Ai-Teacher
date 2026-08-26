'use client';

import { memo } from 'react';
import { Send } from 'lucide-react';
import type { SubmitAskButtonProps } from '../../../types/input.types';

export const SubmitAskButton = memo(function SubmitAskButton({
  loading,
  disabled,
  onSubmit,
  className = '',
}: SubmitAskButtonProps) {
  return (
    <button
      id="ask-btn"
      type="button"
      onClick={onSubmit}
      disabled={disabled}
      className={`px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 shadow-lg shadow-violet-600/20 active:scale-95 ${className}`}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <Send className="w-3.5 h-3.5 text-white" />
      )}
      <span>Ask</span>
    </button>
  );
});

SubmitAskButton.displayName = 'SubmitAskButton';
