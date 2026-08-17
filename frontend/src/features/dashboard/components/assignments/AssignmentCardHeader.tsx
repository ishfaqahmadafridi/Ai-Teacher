'use client';

import { memo } from 'react';
import { FileText, HelpCircle } from 'lucide-react';
import type { AssignmentCardHeaderProps } from '../../types/assignments.types';

export const AssignmentCardHeader = memo(function AssignmentCardHeader({
  type,
  subject,
  points,
}: AssignmentCardHeaderProps) {
  const isQuiz = type === 'quiz';

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Type Badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            isQuiz
              ? 'bg-[#8B5CF6]/20 text-[#C4B5FD] border-[#8B5CF6]/30'
              : 'bg-[#2563EB]/20 text-[#38BDF8] border-[#2563EB]/30'
          }`}
        >
          {isQuiz ? <HelpCircle className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
          <span>{isQuiz ? 'Interactive Quiz' : 'Assignment Task'}</span>
        </span>

        {/* Subject Tag */}
        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#1E293B] text-[#94A3B8] border border-[#334155]">
          {subject}
        </span>
      </div>

      {/* Points Pill */}
      <span className="font-mono text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-1 rounded-xl border border-[#F59E0B]/20 shrink-0">
        {points} PTS
      </span>
    </div>
  );
});

AssignmentCardHeader.displayName = 'AssignmentCardHeader';
