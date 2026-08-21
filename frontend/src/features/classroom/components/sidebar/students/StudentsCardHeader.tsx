'use client';

import { memo } from 'react';
import { Users, ChevronUp, ChevronDown } from 'lucide-react';
import type { StudentsCardHeaderProps } from '../../../types/sidebar.types';

export const StudentsCardHeader = memo(function StudentsCardHeader({
  presentCount,
  totalCount,
  isExpanded,
  onToggle,
  className = '',
}: StudentsCardHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isExpanded}
      className={`w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/5 transition-colors cursor-pointer group text-left ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        <Users className="w-4 h-4 text-[#b8c3ff] shrink-0" aria-hidden="true" />
        <span className="font-['Hanken_Grotesk',sans-serif] text-xs font-bold text-[#e2e2e8] tracking-tight truncate">
          Active Students
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="font-['Hanken_Grotesk',sans-serif] text-xs font-bold text-[#6ffbbe]">
          {presentCount}/{totalCount}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-[#c4c5d9] group-hover:text-white transition-colors" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#c4c5d9] group-hover:text-white transition-colors" aria-hidden="true" />
        )}
      </div>
    </button>
  );
});

StudentsCardHeader.displayName = 'StudentsCardHeader';
