'use client';

import { memo } from 'react';
import { ChatInboxTriggerButton } from './chat/ChatInboxTriggerButton';
import { ChatInboxDrawerContainer } from './chat/ChatInboxDrawerContainer';

export const ClassroomChatInboxPopover = memo(function ClassroomChatInboxPopover() {
  return (
    <div className="relative">
      {/* Messages Inbox Trigger Button */}
      <ChatInboxTriggerButton />

      {/* Messages Inbox Popover Drawer Container */}
      <ChatInboxDrawerContainer />
    </div>
  );
});

ClassroomChatInboxPopover.displayName = 'ClassroomChatInboxPopover';
