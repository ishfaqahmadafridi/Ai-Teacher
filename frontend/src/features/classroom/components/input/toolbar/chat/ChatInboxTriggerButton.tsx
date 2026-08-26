'use client';

import { memo } from 'react';
import { MessageSquare } from 'lucide-react';
import { useChatInboxTrigger } from '../../../../hooks/useChatInboxTrigger';

export const ChatInboxTriggerButton = memo(function ChatInboxTriggerButton() {
  const { messageCount, toggleOpen } = useChatInboxTrigger();

  return (
    <button
      type="button"
      onClick={toggleOpen}
      className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm relative"
      title="Classroom Chat & Messages Inbox"
    >
      <MessageSquare className="w-4 h-4 text-sky-400" />
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
