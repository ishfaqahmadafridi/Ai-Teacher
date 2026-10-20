'use client';

import { memo } from 'react';
import { MessageSquare } from 'lucide-react';
import type { ChatInboxTriggerButtonProps } from '../../../../types/input.types';

export const ChatInboxTriggerButton = memo(function ChatInboxTriggerButton({ isOpen, messageCount, onToggle }: ChatInboxTriggerButtonProps) {

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="min-h-11 px-3 py-2 rounded-xl bg-dashboard-subtle hover:bg-dashboard-selected text-dashboard-text border border-dashboard-border hover:text-dashboard-primary text-xs font-semibold flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashboard-primary transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm relative"
      title="Classroom Chat & Messages Inbox"
    >
      <MessageSquare className="w-4 h-4 text-dashboard-muted" />
      <span>Chat</span>
      {messageCount > 0 && (
        <span className="w-4 h-4 rounded-full bg-sky-500 text-white text-[9px] font-bold flex items-center justify-center -ml-0.5">
          {messageCount}
        </span>
      )}
    </button>
  );
});

ChatInboxTriggerButton.displayName = 'ChatInboxTriggerButton';
