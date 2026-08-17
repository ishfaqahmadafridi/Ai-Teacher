'use client';

import { memo } from 'react';
import type { HeroGreetingContentProps } from '../../types';

export const HeroGreetingContent = memo(function HeroGreetingContent({
  greeting,
  studentName,
  weeklyProgressPercent,
  className = '',
}: HeroGreetingContentProps) {
  return (
    <div className={`z-10 flex-1 min-w-0 text-white space-y-3 py-1 ${className}`}>
      <h1 className="font-['Hanken_Grotesk',sans-serif] text-3xl sm:text-4xl lg:text-[40px] font-bold text-white tracking-tight leading-tight">
        {greeting}, {studentName}
      </h1>
      <p className="font-['Hanken_Grotesk',sans-serif] text-base sm:text-lg text-[#E2E8F0] leading-relaxed max-w-2xl">
        You've learned{' '}
        <span className="font-extrabold text-[#FF6B35] drop-shadow-sm whitespace-nowrap">
          {weeklyProgressPercent}% of your
        </span>{' '}
        goal this week! Keep it up and improve your results!
      </p>
    </div>
  );
});

HeroGreetingContent.displayName = 'HeroGreetingContent';
