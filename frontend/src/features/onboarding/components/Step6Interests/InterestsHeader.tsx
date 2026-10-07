'use client';

import { memo } from 'react';
import { InterestsProgressHeader } from './InterestsProgressHeader';
import type { InterestsHeaderProps } from '../../types';

function InterestsHeaderComponent({ className = '' }: InterestsHeaderProps) {
  return (
    <div className={`space-y-4 font-['Hanken_Grotesk',sans-serif] ${className}`}>
      <InterestsProgressHeader />

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Choose your field of study
        </h1>
        <p className="text-[#94A3B8] text-sm sm:text-base max-w-xl">
          Select one field for your profile. Selecting another field replaces your previous choice. You can register courses in this field from your dashboard.
        </p>
      </div>
    </div>
  );
}

export const InterestsHeader = memo(InterestsHeaderComponent);
InterestsHeader.displayName = 'InterestsHeader';
