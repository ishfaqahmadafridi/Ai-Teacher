'use client';

import { memo } from 'react';
import { Award } from 'lucide-react';
import { ASSIGNMENT_SUBJECT_OPTIONS } from '../../constants/assignmentsConstants';
import type { AssignSubjectPointsInputProps } from '../../types/assignments.types';

export const AssignSubjectPointsInput = memo(function AssignSubjectPointsInput({
  subject,
  points,
  onSubjectChange,
  onPointsChange,
  className = '',
}: AssignSubjectPointsInputProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {/* Subject Dropdown */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-dashboard-muted uppercase tracking-wider">
          Subject / Discipline
        </label>
        <select
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="w-full bg-dashboard-panel border border-dashboard-border rounded-2xl px-4 py-3 text-sm text-dashboard-text focus:outline-none focus:border-dashboard-primary"
        >
          {ASSIGNMENT_SUBJECT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Max Points Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-dashboard-muted uppercase tracking-wider flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-dashboard-warning" />
          Max Points
        </label>
        <input
          type="number"
          min={10}
          max={500}
          value={points}
          onChange={(e) => onPointsChange(Number(e.target.value))}
          className="w-full bg-dashboard-panel border border-dashboard-border rounded-2xl px-4 py-3 text-sm text-dashboard-text focus:outline-none focus:border-dashboard-primary"
        />
      </div>
    </div>
  );
});

AssignSubjectPointsInput.displayName = 'AssignSubjectPointsInput';
