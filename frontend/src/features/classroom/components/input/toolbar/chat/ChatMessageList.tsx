'use client';

import { memo } from 'react';
import { ChatMessageItemRow } from './ChatMessageItemRow';
import type { ChatMessageListProps } from '../../../../types/input.types';

export const ChatMessageList = memo(function ChatMessageList({
  messages,
  className = '',
}: ChatMessageListProps) {
  return (
    <div className={`p-3.5 space-y-3 flex-1 overflow-y-auto min-h-[220px] ${className}`}>
      {messages.map((msg) => (
        <ChatMessageItemRow key={msg.id} msg={msg} />
      ))}
    </div>
  );
});

ChatMessageList.displayName = 'ChatMessageList';
