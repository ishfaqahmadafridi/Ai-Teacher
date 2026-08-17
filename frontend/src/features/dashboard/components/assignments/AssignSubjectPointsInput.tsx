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
        <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
          Subject / Discipline
        </label>
        <select
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="w-full bg-[#090D16] border border-[#1E293B] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
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
        <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
          Max Points
        </label>
        <input
          type="number"
          min={10}
          max={500}
          value={points}
          onChange={(e) => onPointsChange(Number(e.target.value))}
          className="w-full bg-[#090D16] border border-[#1E293B] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
        />
      </div>
    </div>
  );
});

AssignSubjectPointsInput.displayName = 'AssignSubjectPointsInput';
