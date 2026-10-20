'use client';

import { memo } from 'react';
import { Upload, X } from 'lucide-react';
import type { SubmitAssignmentHeaderProps } from '../../types/assignments.types';

export const SubmitAssignmentHeader = memo(function SubmitAssignmentHeader({
  isAlreadySubmitted,
  title,
  subject,
  onClose,
  className = '',
}: SubmitAssignmentHeaderProps) {
  return (
    <div className={`flex items-center justify-between border-b border-dashboard-border pb-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-dashboard-primary/20 border border-dashboard-primary/40 text-dashboard-primary flex items-center justify-center">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-dashboard-text">
            {isAlreadySubmitted ? 'Your Turned In Work' : 'Turn In Work (GCR Submission)'}
          </h3>
          <p className="text-xs text-dashboard-muted">
            {title} ({subject})
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

SubmitAssignmentHeader.displayName = 'SubmitAssignmentHeader';
