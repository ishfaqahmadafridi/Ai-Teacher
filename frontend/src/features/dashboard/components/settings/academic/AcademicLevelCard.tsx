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
    <div className={`p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
          <GraduationCap aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-dashboard-text">Current Academic Level</h4>
          <p className="text-xs text-dashboard-muted">
            Used to adapt course difficulty and problem set complexity.
          </p>
        </div>
      </div>

      <select
        value={academicLevel}
        onChange={(e) => onChangeLevel(e.target.value)}
        className="w-full bg-dashboard-panel border border-dashboard-border rounded-xl px-4 py-2.5 text-sm text-dashboard-text focus:outline-none focus:border-dashboard-primary cursor-pointer"
      >
        {ACADEMIC_LEVEL_OPTIONS.map((level) => (
          <option key={level} value={level} className="bg-dashboard-panel text-dashboard-text">
            {level}
          </option>
        ))}
      </select>
    </div>
  );
});

AcademicLevelCard.displayName = 'AcademicLevelCard';
