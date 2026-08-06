'use client';

import { Button } from '@/components/ui/button';

interface AcademicLevelToggleProps {
  levelMode: 'high_school' | 'university';
  onToggle: (mode: 'high_school' | 'university') => void;
}

export function AcademicLevelToggle({ levelMode, onToggle }: AcademicLevelToggleProps) {
  return (
    <div className="flex p-1.5 bg-white/5 rounded-full mb-10 border border-white/10 backdrop-blur-md">
      <Button
        type="button"
        variant="ghost"
        onClick={() => onToggle('high_school')}
        className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
          levelMode === 'high_school'
            ? 'bg-[#0043eb] text-white shadow-[0_0_20px_rgba(0,67,235,0.5)] hover:bg-[#003ad6]'
            : 'text-[#c6c6cc] hover:text-white hover:bg-transparent'
        }`}
      >
        High School
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => onToggle('university')}
        className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
          levelMode === 'university'
            ? 'bg-[#0043eb] text-white shadow-[0_0_20px_rgba(0,67,235,0.5)] hover:bg-[#003ad6]'
            : 'text-[#c6c6cc] hover:text-white hover:bg-transparent'
        }`}
      >
        University
      </Button>
    </div>
  );
}
