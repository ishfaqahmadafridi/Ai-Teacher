'use client';

import { memo } from 'react';
import { CornerDownLeft } from 'lucide-react';
import type { NoteCustomInputFormProps } from '../../../types/sidebar.types';

export const NoteCustomInputForm = memo(function NoteCustomInputForm({
  customLangInput,
  onCustomLangInputChange,
  onSubmit,
  className = '',
}: NoteCustomInputFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-1.5 animate-in fade-in zoom-in-95 duration-200 ${className}`}
    >
      <div className="flex items-center justify-between px-0.5">
        <label htmlFor="custom-language-input" className="text-[10px] font-mono text-slate-400 block">
          Type Custom Language (Press Enter to Save):
        </label>
      </div>
      <div className="flex items-center gap-1.5">
        <input
          id="custom-language-input"
          type="text"
          value={customLangInput}
          onChange={(e) => onCustomLangInputChange(e.target.value)}
          placeholder="e.g. German, Spanish, French..."
          className="flex-1 px-3 py-1.5 rounded-xl bg-[#060A12] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/40 transition-colors font-sans"
          autoFocus
        />
        <button
          type="submit"
          disabled={!customLangInput.trim()}
          className="px-2.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-sm active:scale-95"
          title="Save custom format and close"
        >
          <CornerDownLeft className="w-3 h-3 text-white" />
          <span>Apply</span>
        </button>
      </div>
    </form>
  );
});

NoteCustomInputForm.displayName = 'NoteCustomInputForm';
