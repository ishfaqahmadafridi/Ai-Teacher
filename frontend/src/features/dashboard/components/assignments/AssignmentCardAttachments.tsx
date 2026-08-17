'use client';

import { memo } from 'react';
import { Paperclip } from 'lucide-react';
import type { AssignmentCardAttachmentsProps } from '../../types/assignments.types';

export const AssignmentCardAttachments = memo(function AssignmentCardAttachments({
  attachments,
}: AssignmentCardAttachmentsProps) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="space-y-1.5 pt-1">
      <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1">
        <Paperclip className="w-3 h-3 text-[#38BDF8]" />
        <span>Reference Attachments ({attachments.length})</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {attachments.map((att, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg bg-[#090D16] border border-[#1E293B] text-[#38BDF8]"
          >
            <span>{att.name}</span>
            <span className="text-[9px] text-[#64748B]">({att.sizeFormatted})</span>
          </div>
        ))}
      </div>
    </div>
  );
});

AssignmentCardAttachments.displayName = 'AssignmentCardAttachments';
