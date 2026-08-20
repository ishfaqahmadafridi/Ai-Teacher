'use client';

import { memo } from 'react';
import { NotificationHeader } from './NotificationHeader';
import { NotificationCardItem } from './NotificationCardItem';
import { NotificationEmptyState } from './NotificationEmptyState';
import type { NotificationDropdownProps } from '../../../types/topbar.types';

export const NotificationDropdown = memo(function NotificationDropdown({
  isOpen,
  notifications,
  unreadCount,
  onMarkAllAsRead,
  onDismissNotification,
  onSelectNotification,
  onClose,
  className = '',
}: NotificationDropdownProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-3xl bg-[#030712]/95 border border-[#1E293B] shadow-2xl backdrop-blur-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 ${className}`}
    >
      <NotificationHeader
        unreadCount={unreadCount}
        onMarkAllAsRead={onMarkAllAsRead}
        onClose={onClose}
      />

      <div className="mt-3 space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <NotificationEmptyState />
        ) : (
          notifications.map((n) => (
            <NotificationCardItem
              key={n.id}
              notification={n}
              onDismiss={onDismissNotification}
              onSelect={onSelectNotification}
            />
          ))
        )}
      </div>
    </div>
  );
});

NotificationDropdown.displayName = 'NotificationDropdown';
