'use client';

import { memo } from 'react';
import { Calendar } from 'lucide-react';
import type { AssignDueDateInstructionsInputProps } from '../../types/assignments.types';

export const AssignDueDateInstructionsInput = memo(function AssignDueDateInstructionsInput({
  dueDate,
  instructions,
  onDueDateChange,
  onInstructionsChange,
  className = '',
}: AssignDueDateInstructionsInputProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Due Date Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-dashboard-muted uppercase tracking-wider flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-dashboard-primary" />
          Due Date *
        </label>
        <input
          type="date"
          required
          value={dueDate}
          onChange={(e) => onDueDateChange(e.target.value)}
          className="w-full bg-dashboard-panel border border-dashboard-border rounded-2xl px-4 py-3 text-sm text-dashboard-text focus:outline-none focus:border-dashboard-primary"
        />
      </div>

      {/* Task Instructions Textarea */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-dashboard-muted uppercase tracking-wider">
          Task Instructions & Guidelines
        </label>
        <textarea
          rows={4}
          value={instructions}
          onChange={(e) => onInstructionsChange(e.target.value)}
          placeholder="Detail the instructions, deliverables, requirements, and evaluation rubric..."
          className="w-full bg-dashboard-panel border border-dashboard-border rounded-2xl p-4 text-sm text-dashboard-text placeholder-dashboard-border focus:outline-none focus:border-dashboard-primary"
        />
      </div>
    </div>
  );
});

AssignDueDateInstructionsInput.displayName = 'AssignDueDateInstructionsInput';
