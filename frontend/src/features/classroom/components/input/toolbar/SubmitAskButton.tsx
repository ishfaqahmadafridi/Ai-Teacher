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
      className={`min-h-11 px-4 py-2 rounded-xl bg-dashboard-primary hover:bg-dashboard-primary-hover text-white text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashboard-primary transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95 ${className}`}
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
