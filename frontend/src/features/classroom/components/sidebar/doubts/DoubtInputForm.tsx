'use client';

import { memo } from 'react';
import { Send } from 'lucide-react';
import type { DoubtInputFormProps } from '../../../types/sidebar.types';

export const DoubtInputForm = memo(function DoubtInputForm({
  query,
  onQueryChange,
  onSubmit,
  loading = false,
  className = '',
}: DoubtInputFormProps) {
  return (
    <form onSubmit={onSubmit} className={`flex items-center gap-1.5 pt-1 ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Ask AI Teacher a doubt..."
        disabled={loading}
        className="flex-1 bg-[#060A12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors font-sans"
      />
      <button
        type="submit"
        disabled={!query.trim() || loading}
        className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition-colors cursor-pointer shrink-0 active:scale-95"
        title="Send Doubt to AI Teacher"
      >
        <Send className="w-3.5 h-3.5" />
      </button>
    </form>
  );
});

DoubtInputForm.displayName = 'DoubtInputForm';
