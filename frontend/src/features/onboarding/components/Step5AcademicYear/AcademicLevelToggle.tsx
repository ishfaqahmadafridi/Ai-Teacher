'use client';

import { memo } from 'react';
import type { AcademicLevelToggleProps } from '../../types';

function AcademicLevelToggleComponent({
  levelMode,
  onToggleLevel,
}: AcademicLevelToggleProps) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-[#0F172A] border border-[#1E293B] rounded-2xl w-fit font-['Hanken_Grotesk',sans-serif]">
      <button
        type="button"
        onClick={() => onToggleLevel('high_school')}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          levelMode === 'high_school'
            ? 'bg-[#2563EB] text-white shadow-md'
            : 'text-[#94A3B8] hover:text-white'
        }`}
      >
        High School
      </button>
      <button
        type="button"
        onClick={() => onToggleLevel('university')}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          levelMode === 'university'
            ? 'bg-[#2563EB] text-white shadow-md'
            : 'text-[#94A3B8] hover:text-white'
        }`}
      >
        University
      </button>
    </div>
  );
}

export const AcademicLevelToggle = memo(AcademicLevelToggleComponent);
AcademicLevelToggle.displayName = 'AcademicLevelToggle';
