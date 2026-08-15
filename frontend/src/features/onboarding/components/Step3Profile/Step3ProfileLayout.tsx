'use client';

import { memo } from 'react';
import type { Step3ProfileLayoutProps } from '../../types';

function Step3ProfileLayoutComponent({ children }: Step3ProfileLayoutProps) {
  return (
    <main className="min-h-screen w-full bg-[#030712] text-white flex flex-col justify-between relative overflow-x-hidden font-['Hanken_Grotesk',sans-serif]">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#2563EB]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-[#38BDF8]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Content Container */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 flex flex-col justify-center">
        {children}
      </div>
    </main>
  );
}

export const Step3ProfileLayout = memo(Step3ProfileLayoutComponent);
Step3ProfileLayout.displayName = 'Step3ProfileLayout';
