'use client';

import { memo } from 'react';
import { Paperclip, X } from 'lucide-react';
import type { AttachmentBadgeProps } from '../../types/ask.types';

export const AttachmentBadge = memo(function AttachmentBadge({
  fileName,
  onRemove,
  className = '',
}: AttachmentBadgeProps) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-dashboard-primary/20 border border-dashboard-border text-xs font-bold text-dashboard-primary shrink-0 ${className}`}>
      <Paperclip className="w-3.5 h-3.5 shrink-0" />
      <span className="max-w-[140px] truncate">{fileName}</span>
      <button
        type="button"
        onClick={onRemove}
        className="hover:text-dashboard-text transition-colors cursor-pointer"
        title="Remove attachment"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
});

AttachmentBadge.displayName = 'AttachmentBadge';
