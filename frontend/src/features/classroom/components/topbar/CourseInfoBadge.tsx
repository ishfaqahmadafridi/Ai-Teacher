'use client';

import { memo } from 'react';
import { Calculator } from 'lucide-react';
import type { CourseInfoBadgeProps } from '../../types/topbar.types';

export const CourseInfoBadge = memo(function CourseInfoBadge({
  subjectTitle = 'Mathematics 101',
  chapterText = 'Chapter 5',
  topicTitle = 'Newton\'s Second Law',
}: CourseInfoBadgeProps) {
  return (
    <div className="flex items-center gap-3 md:gap-4 min-w-0">
      {/* Icon Badge */}
      <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full glass-panel text-[#b8c3ff] shrink-0">
        <Calculator className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
      </div>

      {/* Course Title & Chapter Info */}
      <div className="min-w-0">
        <h1 className="font-['Hanken_Grotesk',sans-serif] text-base md:text-xl font-semibold text-[#e2e2e8] truncate">
          {subjectTitle}
        </h1>
        <p className="font-['Hanken_Grotesk',sans-serif] text-xs text-[#c4c5d9] flex items-center gap-2 truncate">
          <span>{chapterText}</span>
          <span className="w-1 h-1 rounded-full bg-[#c4c5d9]" aria-hidden="true" />
          <span className="truncate">{topicTitle}</span>
        </p>
      </div>
    </div>
  );
});

CourseInfoBadge.displayName = 'CourseInfoBadge';
