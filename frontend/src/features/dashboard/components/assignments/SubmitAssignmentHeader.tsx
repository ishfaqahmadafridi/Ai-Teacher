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
    <div className={`flex items-center justify-between border-b border-[#1E293B] pb-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#38BDF8] flex items-center justify-center">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-white">
            {isAlreadySubmitted ? 'Your Turned In Work' : 'Turn In Work (GCR Submission)'}
          </h3>
          <p className="text-xs text-[#94A3B8]">
            {title} ({subject})
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-2 rounded-xl bg-[#1E293B] text-[#94A3B8] hover:text-white transition-all cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
});

SubmitAssignmentHeader.displayName = 'SubmitAssignmentHeader';
