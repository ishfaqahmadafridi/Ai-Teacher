'use client';

import { memo } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import type { AssignmentsHeaderTitleProps } from '../../types/assignments.types';

export const AssignmentsHeaderTitle = memo(function AssignmentsHeaderTitle({
  onOpenAssignModal,
  className = '',
}: AssignmentsHeaderTitleProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-6 ${className}`}>
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#C4B5FD] text-xs font-bold uppercase tracking-wider mb-2 border border-[#8B5CF6]/30">
          <ClipboardList className="w-4 h-4 text-[#C4B5FD]" />
          <span>GCR Assignments & Quizzes Center</span>
        </div>
        <h2 className="font-['Hanken_Grotesk',sans-serif] text-2xl sm:text-3xl font-black text-white">
          Classroom Tasks & Interactive Quizzes
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Assign new coursework, complete interactive quizzes, upload submission files, and view AI feedback.
        </p>
      </div>

      {/* "+ Assign New Work" Button */}
      <button
        type="button"
        onClick={onOpenAssignModal}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#8B5CF6]/25 transition-all duration-200 cursor-pointer shrink-0"
      >
        <Plus className="w-4 h-4" />
        <span>Assign New Work / Quiz</span>
      </button>
    </div>
  );
});

AssignmentsHeaderTitle.displayName = 'AssignmentsHeaderTitle';
