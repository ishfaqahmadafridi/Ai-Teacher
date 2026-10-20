'use client';

import { memo } from 'react';
import type { HeroGreetingContentProps } from '../../types';

export const HeroGreetingContent = memo(function HeroGreetingContent({ greeting, studentName, weeklyProgressPercent, className = '' }: HeroGreetingContentProps) {
  return (
    <div className={`min-w-0 space-y-2 ${className}`}>
      <h1 className="text-2xl font-semibold leading-tight tracking-tight text-dashboard-text sm:text-3xl">{greeting}, {studentName}</h1>
      <p className="text-sm leading-6 text-dashboard-muted">
        {weeklyProgressPercent > 0 ? `You’re ${weeklyProgressPercent}% of the way to your weekly goal. Keep going.` : 'Make room for a little progress today. Your courses are ready when you are.'}
      </p>
    </div>
  );
});
HeroGreetingContent.displayName = 'HeroGreetingContent';
