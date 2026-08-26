'use client';

import { useClassroomChatInbox } from './useClassroomChatInbox';

export function useChatInboxDrawer() {
  const { isOpen, messages, toggleOpen } = useClassroomChatInbox();

  return {
    isOpen,
    messages,
    toggleOpen,
  };
}
