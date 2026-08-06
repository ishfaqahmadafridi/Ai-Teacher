'use client';

import { ReactNode } from 'react';
import { AcademicBackgroundGradients } from './AcademicBackgroundGradients';
import { AcademicProgressHeader } from './AcademicProgressHeader';
import { AcademicHeader } from './AcademicHeader';

interface Step5AcademicLayoutProps {
  children: ReactNode;
}

export function Step5AcademicLayout({ children }: Step5AcademicLayoutProps) {
  return (
    <div className="min-h-screen bg-[#131314] text-[#e5e2e3] font-sans relative overflow-x-hidden flex flex-col items-center pt-6 pb-20">
      <AcademicBackgroundGradients />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-center">
        <AcademicProgressHeader step={5} totalSteps={6} percentage={83} />
        <AcademicHeader />
        {children}
      </div>
    </div>
  );
}
