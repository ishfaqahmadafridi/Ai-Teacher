'use client';

import { memo } from 'react';
import { MessageSquare } from 'lucide-react';
import type { SubmitAssignmentTextNoteInputProps } from '../../types/assignments.types';

export const SubmitAssignmentTextNoteInput = memo(function SubmitAssignmentTextNoteInput({
  textNote,
  onTextNoteChange,
  className = '',
}: SubmitAssignmentTextNoteInputProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1">
        <MessageSquare className="w-3.5 h-3.5 text-[#38BDF8]" />
        Private Submission Note / Explanation
      </label>
      <textarea
        rows={3}
        value={textNote}
        onChange={(e) => onTextNoteChange(e.target.value)}
        placeholder="Add any comments or notes for your teacher regarding this submission..."
        className="w-full bg-[#090D16] border border-[#1E293B] rounded-2xl p-4 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#2563EB]"
      />
    </div>
  );
});

SubmitAssignmentTextNoteInput.displayName = 'SubmitAssignmentTextNoteInput';
