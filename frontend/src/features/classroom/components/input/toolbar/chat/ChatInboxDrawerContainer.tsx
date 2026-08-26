'use client';

import { memo } from 'react';
import { useChatInboxDrawer } from '../../../../hooks/useChatInboxDrawer';
import { ChatInboxHeader } from './ChatInboxHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInputBar } from './ChatInputBar';

export const ChatInboxDrawerContainer = memo(function ChatInboxDrawerContainer() {
  const { isOpen, messages, toggleOpen } = useChatInboxDrawer();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute bottom-full left-0 mb-3 z-50 w-80 sm:w-96 bg-[#0B132B]/95 border border-slate-700/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[420px] animate-in fade-in zoom-in-95 duration-150 font-sans">
      <ChatInboxHeader onClose={toggleOpen} />
      <ChatMessageList messages={messages} />
      <ChatInputBar />
    </div>
  );
});

ChatInboxDrawerContainer.displayName = 'ChatInboxDrawerContainer';
