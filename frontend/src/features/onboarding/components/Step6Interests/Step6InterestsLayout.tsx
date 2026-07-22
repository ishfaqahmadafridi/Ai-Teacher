'use client';

import { ReactNode } from 'react';
import { InterestsBackgroundGradients } from './InterestsBackgroundGradients';
import { InterestsProgressHeader } from './InterestsProgressHeader';

interface Step6InterestsLayoutProps {
  children: ReactNode;
  mobileBar?: ReactNode;
}

export function Step6InterestsLayout({ children, mobileBar }: Step6InterestsLayoutProps) {
  return (
    <div className="min-h-screen bg-[#131314] text-[#e5e2e3] font-sans relative overflow-x-hidden flex flex-col justify-start pt-6 pb-20">
      <InterestsBackgroundGradients />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col gap-8">
        <InterestsProgressHeader step={6} totalSteps={6} percentage={100} />
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {children}
        </div>
      </div>

      {mobileBar}
    </div>
  );
}
