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
      <label className="text-xs font-bold text-dashboard-muted uppercase tracking-wider">
        Task Title *
      </label>
      <input
        type="text"
        required
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="e.g. Build Neural Network Model from Scratch"
        className="w-full bg-dashboard-panel border border-dashboard-border rounded-2xl px-4 py-3 text-sm text-dashboard-text placeholder-dashboard-border focus:outline-none focus:border-dashboard-primary"
      />
    </div>
  );
});

AssignTaskTitleInput.displayName = 'AssignTaskTitleInput';
