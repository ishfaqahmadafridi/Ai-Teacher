'use client';

interface StepProgressHeaderProps {
  step: number;
  totalSteps: number;
  percentage: number;
}

export function StepProgressHeader({ step, totalSteps, percentage }: StepProgressHeaderProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 text-sm font-medium">
        <span className="text-[#c6c6cc]">Step {step} of {totalSteps}</span>
        <span className="text-[#ddb7ff] font-semibold">{percentage}% Complete</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#0043eb] to-[#ddb7ff] transition-all duration-500 rounded-full shadow-[0_0_15px_rgba(0,67,235,0.8)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
