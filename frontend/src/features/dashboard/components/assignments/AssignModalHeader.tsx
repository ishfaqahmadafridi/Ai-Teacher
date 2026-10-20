'use client';

import { memo } from 'react';
import { Plus, X } from 'lucide-react';
import type { AssignModalHeaderProps } from '../../types/assignments.types';

export const AssignModalHeader = memo(function AssignModalHeader({
  onClose,
  className = '',
}: AssignModalHeaderProps) {
  return (
    <div className={`flex items-center justify-between border-b border-dashboard-border pb-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-dashboard-primary/20 border border-dashboard-primary/40 text-dashboard-primary flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-dashboard-text">
            Assign New Work / Quiz (GCR)
          </h3>
          <p className="text-xs text-dashboard-muted">
            Create and publish an assignment or quiz task for your students.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-2 rounded-xl bg-dashboard-subtle text-dashboard-muted hover:text-dashboard-text transition-all cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
});

AssignModalHeader.displayName = 'AssignModalHeader';
