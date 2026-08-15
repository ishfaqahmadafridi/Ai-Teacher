'use client';

import { memo } from 'react';
import { X } from 'lucide-react';
import type { SelectedFieldsListProps } from '../../../types';

export const SelectedFieldsList = memo(function SelectedFieldsList({
  selectedInterests,
  onToggleInterest,
}: SelectedFieldsListProps) {
  if (selectedInterests.length === 0) return null;

  return (
    <div className="space-y-2 relative z-10 animate-in fade-in duration-200">
      <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
        Selected Fields ({selectedInterests.length})
      </span>
      <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
        {selectedInterests.map((subject) => (
          <div
            key={subject}
            className="flex items-center justify-between px-3 py-2 bg-[#0F172A] border border-[#1E293B] hover:border-[#2563EB]/40 rounded-xl text-xs font-semibold text-white transition-all shadow-sm group"
          >
            <span className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] shrink-0 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
              <span className="truncate">{subject}</span>
            </span>
            <button
              type="button"
              onClick={() => onToggleInterest(subject)}
              className="text-[#94A3B8] hover:text-red-400 p-0.5 rounded-lg hover:bg-white/10 transition-colors ml-2 cursor-pointer shrink-0"
              title="Remove subject"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

SelectedFieldsList.displayName = 'SelectedFieldsList';
