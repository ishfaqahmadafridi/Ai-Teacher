'use client';

import { memo } from 'react';
import { GraduationCap } from 'lucide-react';
import { ACADEMIC_LEVEL_OPTIONS } from '../../../constants/settingsConstants';
import type { AcademicLevelCardProps } from '../../../types/settings.types';

export const AcademicLevelCard = memo(function AcademicLevelCard({
  academicLevel,
  onChangeLevel,
  className = '',
}: AcademicLevelCardProps) {
  return (
    <div className={`p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Current Academic Level</h4>
          <p className="text-xs text-[#94A3B8]">
            Used to adapt course difficulty and problem set complexity.
          </p>
        </div>
      </div>

      <select
        value={academicLevel}
        onChange={(e) => onChangeLevel(e.target.value)}
        className="w-full bg-[#070D1A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8] cursor-pointer"
      >
        {ACADEMIC_LEVEL_OPTIONS.map((level) => (
          <option key={level} value={level} className="bg-[#0F172A] text-white">
            {level}
          </option>
        ))}
      </select>
    </div>
  );
});

AcademicLevelCard.displayName = 'AcademicLevelCard';
