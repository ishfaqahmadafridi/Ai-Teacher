'use client';

import { memo } from 'react';
import { Sparkles } from 'lucide-react';
import type { DoubtPromptListProps } from '../../../types/sidebar.types';

export const DoubtPromptList = memo(function DoubtPromptList({
  prompts,
  onPromptClick,
  loading = false,
  className = '',
}: DoubtPromptListProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onPromptClick(prompt)}
          disabled={loading}
          className="w-full text-left p-2.5 rounded-xl bg-[#090D16] hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-white transition-all duration-200 flex items-center justify-between gap-2 group cursor-pointer"
        >
          <span className="truncate font-['Hanken_Grotesk',sans-serif]">{prompt}</span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all shrink-0" />
        </button>
      ))}
    </div>
  );
});

DoubtPromptList.displayName = 'DoubtPromptList';
