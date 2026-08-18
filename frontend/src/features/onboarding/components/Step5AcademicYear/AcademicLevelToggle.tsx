'use client';

import { memo } from 'react';
import type { AcademicLevelToggleProps, AcademicYearMode } from '../../types';

const LEVEL_TABS: { id: AcademicYearMode; label: string }[] = [
  { id: 'high_school', label: 'High School' },
  { id: 'university', label: 'University' },
  { id: 'professional', label: 'Professional' },
  { id: 'self_learner', label: 'Lifelong' },
];

function AcademicLevelToggleComponent({
  levelMode,
  onToggleLevel,
}: AcademicLevelToggleProps) {
  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-[#0F172A] border border-[#1E293B] rounded-2xl w-fit font-['Hanken_Grotesk',sans-serif]">
      {LEVEL_TABS.map((tab) => {
        const isSelected = levelMode === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onToggleLevel(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
