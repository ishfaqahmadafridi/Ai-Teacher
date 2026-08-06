'use client';

import { memo } from 'react';
import type { LessonNavigatorHeaderProps } from '../../types/sidebar.types';

export const LessonNavigatorHeader = memo(function LessonNavigatorHeader({
  title = 'Lesson Navigator',
  moduleSubtitle = 'Module 4: Theoretical Physics',
}: LessonNavigatorHeaderProps) {
  return (
    <div className="p-5 md:p-6 border-b border-white/10 shrink-0">
      <h2 className="font-['Hanken_Grotesk',sans-serif] text-base md:text-lg font-bold text-[#e2e2e8] mb-1 tracking-tight">
        {title}
      </h2>
      <p className="font-['Hanken_Grotesk',sans-serif] text-xs text-[#c4c5d9]">
        {moduleSubtitle}
      </p>
    </div>
  );
});

LessonNavigatorHeader.displayName = 'LessonNavigatorHeader';
