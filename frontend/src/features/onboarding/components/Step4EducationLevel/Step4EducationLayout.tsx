'use client';

import { ReactNode } from 'react';
import { EducationBackgroundGradients } from './EducationBackgroundGradients';
import { EducationProgressHeader } from './EducationProgressHeader';
import { EducationHeader } from './EducationHeader';

interface Step4EducationLayoutProps {
  children: ReactNode;
}

export function Step4EducationLayout({ children }: Step4EducationLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0F1D] text-[#e5e2e3] font-sans relative overflow-x-hidden flex flex-col items-center pt-6 pb-16">
      <EducationBackgroundGradients />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-center">
        <EducationProgressHeader step={4} totalSteps={6} percentage={66} />
        <EducationHeader />
        {children}
      </div>
    </div>
  );
}
