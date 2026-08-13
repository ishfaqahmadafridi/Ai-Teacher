'use client';

import { memo } from 'react';
import { HelpCircle, X } from 'lucide-react';
import type { QuizPlayerHeaderProps } from '../../types/assignments.types';

export const QuizPlayerHeader = memo(function QuizPlayerHeader({
  title,
  subject,
  points,
  onClose,
  className = '',
}: QuizPlayerHeaderProps) {
  return (
    <div className={`flex items-center justify-between border-b border-[#1E293B] pb-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#C4B5FD] flex items-center justify-center">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-white">
            {title}
          </h3>
          <p className="text-xs text-[#94A3B8]">
            {subject} • {points} Points Total
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-2 rounded-xl bg-[#1E293B] text-[#94A3B8] hover:text-white transition-all cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
});

QuizPlayerHeader.displayName = 'QuizPlayerHeader';
