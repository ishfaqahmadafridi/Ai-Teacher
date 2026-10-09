'use client';

import { memo } from 'react';
import { ClipboardList } from 'lucide-react';
import type { AssignmentsHeaderTitleProps } from '../../types/assignments.types';

export const AssignmentsHeaderTitle = memo(function AssignmentsHeaderTitle({
  className = '',
}: AssignmentsHeaderTitleProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-6 ${className}`}>
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#C4B5FD] text-xs font-bold uppercase tracking-wider mb-2 border border-[#8B5CF6]/30">
          <ClipboardList className="w-4 h-4 text-[#C4B5FD]" />
          <span>Assignments & Quizzes</span>
        </div>
        <h2 className="font-['Hanken_Grotesk',sans-serif] text-2xl sm:text-3xl font-black text-white">
          Classroom Tasks & Interactive Quizzes
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          View your assigned coursework, complete quizzes, upload submissions, and review feedback.
        </p>
      </div>


    </div>
  );
});

AssignmentsHeaderTitle.displayName = 'AssignmentsHeaderTitle';
