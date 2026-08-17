'use client';

import { memo } from 'react';
import type { AssignTaskTitleInputProps } from '../../types/assignments.types';

export const AssignTaskTitleInput = memo(function AssignTaskTitleInput({
  title,
  onTitleChange,
  className = '',
}: AssignTaskTitleInputProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
        Task Title *
      </label>
      <input
        type="text"
        required
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="e.g. Build Neural Network Model from Scratch"
        className="w-full bg-[#090D16] border border-[#1E293B] rounded-2xl px-4 py-3 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#8B5CF6]"
      />
    </div>
  );
});

AssignTaskTitleInput.displayName = 'AssignTaskTitleInput';
