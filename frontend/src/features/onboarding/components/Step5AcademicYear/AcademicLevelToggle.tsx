'use client';

import { memo } from 'react';
import type { AcademicLevelToggleProps, AcademicYearMode } from '../../types';

const LEVEL_TABS: { id: AcademicYearMode; label: string }[] = [
  { id: 'primary', label: 'Primary' },
  { id: 'middle', label: 'Middle' },
  { id: 'high_school', label: 'High School' },
  { id: 'undergraduate', label: 'College' },
  { id: 'postgraduate', label: 'University' },
  { id: 'professional', label: 'Professional' },
  { id: 'self_learner', label: 'Lifelong' },
];

function AcademicLevelToggleComponent({
  levelMode,
  onToggleLevel,
}: AcademicLevelToggleProps) {
  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-[#0F172A] border border-[#1E293B] rounded-2xl max-w-full overflow-x-auto font-['Hanken_Grotesk',sans-serif] scrollbar-none">
      {LEVEL_TABS.map((tab) => {
        const isSelected = levelMode === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onToggleLevel(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              isSelected
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export const AcademicLevelToggle = memo(AcademicLevelToggleComponent);
AcademicLevelToggle.displayName = 'AcademicLevelToggle';
