'use client';

import { memo } from 'react';
import { ClipboardList } from 'lucide-react';
import type { AssignmentsHeaderTitleProps } from '../../types/assignments.types';

export const AssignmentsHeaderTitle = memo(function AssignmentsHeaderTitle({
  className = '',
}: AssignmentsHeaderTitleProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dashboard-border pb-6 ${className}`}>
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dashboard-primary/20 text-dashboard-primary text-xs font-bold uppercase tracking-wider mb-2 border border-dashboard-primary/30">
          <ClipboardList className="w-4 h-4 text-dashboard-primary" />
          <span>Assignments & Quizzes</span>
        </div>
        <h2 className="font-['Hanken_Grotesk',sans-serif] text-2xl sm:text-3xl font-black text-dashboard-text">
          Classroom Tasks & Interactive Quizzes
        </h2>
        <p className="text-xs sm:text-sm text-dashboard-muted mt-1">
          View your assigned coursework, complete quizzes, upload submissions, and review feedback.
        </p>
      </div>


    </div>
  );
});

AssignmentsHeaderTitle.displayName = 'AssignmentsHeaderTitle';
