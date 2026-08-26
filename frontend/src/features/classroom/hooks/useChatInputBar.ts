'use client';

import { useClassroomChatInbox } from './useClassroomChatInbox';

export function useChatInputBar() {
  const { inputMsg, setInputMsg, handleSendMessage } = useClassroomChatInbox();

  return {
    inputMsg,
    setInputMsg,
    handleSendMessage,
  };
}
