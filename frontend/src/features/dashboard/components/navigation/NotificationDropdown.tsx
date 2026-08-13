'use client';

import { memo } from 'react';
import { NotificationHeader } from './NotificationHeader';
import { NotificationCardItem } from './NotificationCardItem';
import { NotificationEmptyState } from './NotificationEmptyState';
import type { NotificationDropdownProps } from '../../types/topbar.types';

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
      className={`absolute right-0 top-14 w-80 sm:w-96 bg-[#0F172A] border border-[#1E293B] rounded-3xl shadow-2xl z-50 p-4 space-y-3 font-['Hanken_Grotesk',sans-serif] animate-fadeIn ${className}`}
    >
      {/* Popover Header */}
      <NotificationHeader
        unreadCount={unreadCount}
        onMarkAllAsRead={onMarkAllAsRead}
        onClose={onClose}
      />

      {/* Notifications List Body */}
      <div className="max-h-80 overflow-y-auto space-y-2 pr-1 no-scrollbar">
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
