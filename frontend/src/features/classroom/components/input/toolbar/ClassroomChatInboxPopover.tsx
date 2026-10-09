'use client';

import { useClassroomChatInbox } from '../../../hooks/useClassroomChatInbox';
import { memo } from 'react';
import { ChatInboxTriggerButton } from './chat/ChatInboxTriggerButton';
import { ChatInboxDrawerContainer } from './chat/ChatInboxDrawerContainer';

export const ClassroomChatInboxPopover = memo(function ClassroomChatInboxPopover() {
  const { surfaceRef, isOpen, messages, toggleOpen, close, inputMsg, setInputMsg, handleSendMessage } = useClassroomChatInbox();
  return (
    <div ref={surfaceRef} className="relative">
      {/* Messages Inbox Trigger Button */}
      <ChatInboxTriggerButton isOpen={isOpen} messageCount={messages.length} onToggle={toggleOpen} />

      {/* Messages Inbox Popover Drawer Container */}
      <ChatInboxDrawerContainer isOpen={isOpen} messages={messages} onClose={close} inputMsg={inputMsg} onChange={setInputMsg} onSend={handleSendMessage} />
    </div>
  );
});

ClassroomChatInboxPopover.displayName = 'ClassroomChatInboxPopover';
