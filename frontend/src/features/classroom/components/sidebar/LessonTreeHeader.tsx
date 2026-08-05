'use client';

import { memo } from 'react';
import { GraduationCap, ChevronUp, ChevronDown } from 'lucide-react';
import type { LessonTreeHeaderProps } from '../../types/sidebar.types';

export const LessonTreeHeader = memo(function LessonTreeHeader({
  title,
  isExpanded,
  onToggle,
  className = '',
}: LessonTreeHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center gap-3 p-3.5 text-[#b8c3ff] font-['Hanken_Grotesk',sans-serif] font-bold text-sm bg-[#2e5bff]/5 hover:bg-[#2e5bff]/10 transition-colors text-left cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2e5bff] ${className}`}
      aria-expanded={isExpanded}
    >
      <GraduationCap className="w-5 h-5 text-[#b8c3ff] shrink-0" aria-hidden="true" />
      <span className="flex-1">{title}</span>
      {isExpanded ? (
        <ChevronUp className="w-4 h-4 text-[#c4c5d9]" aria-hidden="true" />
      ) : (
        <ChevronDown className="w-4 h-4 text-[#c4c5d9]" aria-hidden="true" />
      )}
    </button>
  );
});

LessonTreeHeader.displayName = 'LessonTreeHeader';
