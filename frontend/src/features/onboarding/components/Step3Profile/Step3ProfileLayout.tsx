'use client';

import { ReactNode } from 'react';
import { BackgroundGradients } from './BackgroundGradients';
import { StepProgressHeader } from './StepProgressHeader';

interface Step3ProfileLayoutProps {
  children: ReactNode;
}

export function Step3ProfileLayout({ children }: Step3ProfileLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0F1D] text-[#e5e2e3] font-sans relative overflow-x-hidden flex flex-col justify-start pt-6 pb-12">
      <BackgroundGradients />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col gap-6">
        <StepProgressHeader step={3} totalSteps={6} percentage={50} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
