'use client';

import { memo } from 'react';
import { GraduationCap, ChevronUp, ChevronDown } from 'lucide-react';
import type { LessonTreeHeaderProps } from '../../../types/sidebar.types';

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
      aria-expanded={isExpanded}
      className={`w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/5 transition-colors cursor-pointer group text-left ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        <GraduationCap className="w-4 h-4 text-[#b8c3ff] shrink-0" aria-hidden="true" />
        <span className="font-['Hanken_Grotesk',sans-serif] text-xs font-bold text-[#e2e2e8] tracking-tight truncate">
          {title}
        </span>
      </div>
      {isExpanded ? (
        <ChevronUp className="w-4 h-4 text-[#c4c5d9] group-hover:text-white shrink-0 transition-colors" aria-hidden="true" />
      ) : (
        <ChevronDown className="w-4 h-4 text-[#c4c5d9] group-hover:text-white shrink-0 transition-colors" aria-hidden="true" />
      )}
    </button>
  );
});

LessonTreeHeader.displayName = 'LessonTreeHeader';
