'use client';

import { memo } from 'react';
import { X } from 'lucide-react';
import { useNotificationCardItem } from '../../hooks';
import { NotificationCardIcon } from './NotificationCardIcon';
import { NotificationCardContent } from './NotificationCardContent';
import type { NotificationCardItemProps } from '../../types/topbar.types';

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
      className={`p-3.5 rounded-2xl border transition-all relative flex gap-3 cursor-pointer hover:border-[#8B5CF6]/50 hover:shadow-lg ${cardStyles} ${className}`}
    >
      {/* Type Icon Badge */}
      <NotificationCardIcon
        isDeadline={isDeadline}
        isGraded={isGraded}
        iconStyles={iconStyles}
      />

      {/* Text Content */}
      <NotificationCardContent
        title={notification.title}
        message={notification.message}
        timeFormatted={notification.timeFormatted}
      />

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={handleDismiss}
        className="text-[#64748B] hover:text-[#EF4444] self-start p-1 transition-colors cursor-pointer"
        title="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
});

NotificationCardItem.displayName = 'NotificationCardItem';
