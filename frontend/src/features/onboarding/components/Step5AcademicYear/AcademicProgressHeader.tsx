'use client';

interface AcademicProgressHeaderProps {
  step: number;
  totalSteps: number;
  percentage: number;
}

export function AcademicProgressHeader({ step, totalSteps, percentage }: AcademicProgressHeaderProps) {
  return (
    <div className="w-full max-w-3xl mb-10">
      <div className="flex justify-between items-center mb-2.5 text-sm font-medium">
        <span className="text-[#c6c6cc] uppercase tracking-widest text-xs font-semibold">
          Step {step} of {totalSteps}
        </span>
        <span className="text-[#00d2ff] font-semibold">{percentage}% Complete</span>
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
