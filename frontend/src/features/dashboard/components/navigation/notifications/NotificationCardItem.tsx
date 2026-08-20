'use client';

import { memo } from 'react';
import { X } from 'lucide-react';
import { useNotificationCardItem } from '../../../hooks';
import { NotificationCardIcon } from './NotificationCardIcon';
import { NotificationCardContent } from './NotificationCardContent';
import type { NotificationCardItemProps } from '../../../types/topbar.types';

export const NotificationCardItem = memo(function NotificationCardItem({
  notification,
  onDismiss,
  onSelect,
  className = '',
}: NotificationCardItemProps) {
  const { isDeadline, isGraded, cardStyles, iconStyles, handleDismiss, handleCardClick } =
    useNotificationCardItem(notification, onDismiss, onSelect);

  return (
    <div
      onClick={handleCardClick}
      className={`relative flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${cardStyles} ${className}`}
    >
      <NotificationCardIcon
        isDeadline={isDeadline}
        isGraded={isGraded}
        iconStyles={iconStyles}
      />
      <NotificationCardContent
        title={notification.title}
        message={notification.message}
        timeFormatted={notification.timeFormatted}
      />
      {notification.isUnread && (
        <span className="w-2 h-2 rounded-full bg-[#8B5CF6] shrink-0 mt-1" />
      )}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        className="text-[#64748B] hover:text-white p-1 rounded-lg hover:bg-[#1E293B] transition-all"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
});

NotificationCardItem.displayName = 'NotificationCardItem';
