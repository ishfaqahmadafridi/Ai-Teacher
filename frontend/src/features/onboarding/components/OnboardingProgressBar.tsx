'use client';

import type { OnboardingProgressBarProps } from '../types';

export function OnboardingProgressBar({ currentStep, totalSteps = 6 }: OnboardingProgressBarProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="fixed top-[64px] w-full z-40 px-4 md:px-10 py-3 bg-[#0a0f1d]/80 backdrop-blur-md">
      <div className="max-w-[720px] mx-auto">
        <div className="flex justify-between items-center mb-1.5 text-xs tracking-wide">
          <span className="text-[#c6c6cc]/80 font-medium">Step {currentStep} of {totalSteps}</span>
          <span className="text-[#ddb7ff] font-semibold">{percentage}% Complete</span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0043eb] via-[#805ad5] to-[#ddb7ff] transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(0,67,235,0.8)]"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

