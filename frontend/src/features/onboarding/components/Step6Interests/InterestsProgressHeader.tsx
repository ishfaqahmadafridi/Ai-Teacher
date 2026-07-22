'use client';

interface InterestsProgressHeaderProps {
  step: number;
  totalSteps: number;
  percentage: number;
}

export function InterestsProgressHeader({ step, totalSteps, percentage }: InterestsProgressHeaderProps) {
  return (
    <div className="w-full bg-[#1c1b1d]/60 border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
      <div className="flex justify-between items-center mb-2.5 text-sm font-medium">
        <span className="text-[#c6c6cc]">Step {step} of {totalSteps}</span>
        <span className="text-[#b8c3ff] font-semibold">{percentage}% Complete</span>
      </div>
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#0043eb] to-[#ddb7ff] transition-all duration-500 rounded-full shadow-[0_0_15px_rgba(0,67,235,0.8)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
