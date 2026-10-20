'use client';

import { memo } from 'react';
import { MessageSquare, X } from 'lucide-react';
import type { ChatInboxHeaderProps } from '../../../../types/input.types';

export const ChatInboxHeader = memo(function ChatInboxHeader({
  onClose,
  className = '',
}: ChatInboxHeaderProps) {
  return (
    <div
      className={`p-3.5 border-b border-dashboard-border flex items-center justify-between bg-dashboard-subtle/60 ${className}`}
    >
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-sky-400" />
        <h3 className="text-xs font-bold text-dashboard-text font-mono tracking-wide">
          Classroom Live Chat & Doubts
        </h3>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-dashboard-muted hover:text-dashboard-primary transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
});

ChatInboxHeader.displayName = 'ChatInboxHeader';
