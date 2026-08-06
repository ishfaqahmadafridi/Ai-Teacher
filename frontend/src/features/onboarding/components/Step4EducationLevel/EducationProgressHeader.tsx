'use client';

interface EducationProgressHeaderProps {
  step: number;
  totalSteps: number;
  percentage: number;
}

export function EducationProgressHeader({ step, totalSteps, percentage }: EducationProgressHeaderProps) {
  return (
    <div className="w-full max-w-3xl mb-12">
      <div className="flex justify-between items-center mb-2 text-sm font-medium">
        <span className="text-[#ddb7ff] uppercase tracking-widest text-xs font-semibold">
          Step {step} of {totalSteps}
        </span>
        <span className="text-[#c6c6cc]">Personalization ({percentage}%)</span>
      </div>
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#0043eb] to-[#ddb7ff] rounded-full shadow-[0_0_15px_rgba(0,67,235,0.8)] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
