'use client';

import { memo } from 'react';
import type { Step6InterestsLayoutProps } from '../../types';

function Step6InterestsLayoutComponent({ children, mobileBar }: Step6InterestsLayoutProps) {
  return (
    <main className="min-h-screen w-full bg-[#030712] text-white flex flex-col relative overflow-x-hidden font-['Hanken_Grotesk',sans-serif]">
      {/* Radial Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#2563EB]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#38BDF8]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Content Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          {children}
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      {mobileBar}
    </main>
  );
}

export const Step6InterestsLayout = memo(Step6InterestsLayoutComponent);
Step6InterestsLayout.displayName = 'Step6InterestsLayout';
