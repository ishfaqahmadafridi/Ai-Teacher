'use client';

import { memo } from 'react';
import { Users, ChevronUp, ChevronDown } from 'lucide-react';
import type { StudentsCardHeaderProps } from '../../types/sidebar.types';

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
      className={`w-full flex items-center gap-3 p-3.5 text-[#b8c3ff] font-['Hanken_Grotesk',sans-serif] font-bold text-sm bg-[#2e5bff]/5 hover:bg-[#2e5bff]/10 transition-colors text-left cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2e5bff] ${className}`}
      aria-expanded={isExpanded}
    >
      <Users className="w-5 h-5 text-[#b8c3ff] shrink-0" aria-hidden="true" />
      <span className="flex-1">Students</span>
      <span className="text-[10px] font-bold text-[#6ffbbe] bg-[#00a572]/15 border border-[#00a572]/30 px-2 py-0.5 rounded-full mr-1 shrink-0 font-mono">
        {presentCount} / {totalCount}
      </span>
      {isExpanded ? (
        <ChevronUp className="w-4 h-4 text-[#c4c5d9]" aria-hidden="true" />
      ) : (
        <ChevronDown className="w-4 h-4 text-[#c4c5d9]" aria-hidden="true" />
      )}
    </button>
  );
});

StudentsCardHeader.displayName = 'StudentsCardHeader';
