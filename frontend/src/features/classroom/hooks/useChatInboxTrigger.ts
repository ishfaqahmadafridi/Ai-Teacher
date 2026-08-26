'use client';

import { useClassroomChatInbox } from './useClassroomChatInbox';

export function useChatInboxTrigger() {
  const { isOpen, messages, toggleOpen } = useClassroomChatInbox();

  return {
    isOpen,
    messageCount: messages.length,
    toggleOpen,
  };
}
