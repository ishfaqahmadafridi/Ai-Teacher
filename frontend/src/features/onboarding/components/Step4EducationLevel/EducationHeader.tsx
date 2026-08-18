'use client';

import { memo } from 'react';
import { EducationProgressHeader } from './EducationProgressHeader';

export const EducationHeader = memo(function EducationHeader() {
  return (
    <div className="flex flex-col items-center text-center mb-10 max-w-3xl mx-auto space-y-4">
      <EducationProgressHeader />

      <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight" style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}>
        Choose Your Learning Journey
      </h1>
      <p className="text-[#94A3B8] text-base md:text-lg max-w-xl mx-auto leading-relaxed font-['Hanken_Grotesk',sans-serif]">
        Select your current education level to personalize your courses and unlock AI-powered learning paths tailored for you.
      </p>
    </div>
  );
});

EducationHeader.displayName = 'EducationHeader';

