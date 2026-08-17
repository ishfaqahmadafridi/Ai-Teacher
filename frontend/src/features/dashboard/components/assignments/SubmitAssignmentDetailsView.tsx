'use client';

import { memo } from 'react';
import { CheckCircle2, File } from 'lucide-react';
import type { SubmitAssignmentDetailsViewProps } from '../../types/assignments.types';

export const SubmitAssignmentDetailsView = memo(function SubmitAssignmentDetailsView({
  submission,
  className = '',
}: SubmitAssignmentDetailsViewProps) {
  if (!submission) return null;

  return (
    <div className={`p-4 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-xs font-bold text-[#10B981]">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          Work Turned In Successfully
        </span>
        <span className="font-mono">{submission.submittedAt}</span>
      </div>

      {submission.textNote && (
        <div className="text-xs text-[#A7F3D0] italic bg-[#090D16] p-3 rounded-xl border border-[#10B981]/20">
          &ldquo;{submission.textNote}&rdquo;
        </div>
      )}

      {submission.files.length > 0 && (
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-[#A7F3D0] uppercase tracking-wider">
            Submitted Files ({submission.files.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {submission.files.map((f, i) => (
              <div
                key={i}
                className="px-3 py-1.5 rounded-xl bg-[#090D16] border border-[#10B981]/30 text-xs text-[#38BDF8] flex items-center gap-2"
              >
                <File className="w-3.5 h-3.5" />
                <span>{f.name}</span>
                <span className="text-[10px] text-[#64748B]">({f.sizeFormatted})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

SubmitAssignmentDetailsView.displayName = 'SubmitAssignmentDetailsView';
