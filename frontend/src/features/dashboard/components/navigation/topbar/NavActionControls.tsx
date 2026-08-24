'use client';

import { memo } from 'react';
import { useNotificationDropdown } from '../../../hooks';
import { NotificationDropdown, NavNotificationButton } from '../notifications';
import type { NavActionControlsProps } from '../../../types/topbar.types';

export const NavActionControls = memo(function NavActionControls({
  studentAvatar,
  onOpenProfile,
  onOpenSettings,
  onNotificationClick,
  className = '',
}: NavActionControlsProps) {
  const {
    isOpen,
    notifications,
    unreadCount,
    toggleOpen,
    handleClose,
    handleMarkAllAsRead,
    handleDismissNotification,
    handleSelectNotification,
  } = useNotificationDropdown({
    onNotificationClick,
  });

  return (
    <div className={`relative flex items-center gap-3 ${className}`}>
      <NavNotificationButton
        unreadCount={unreadCount}
        onClick={toggleOpen}
      />

      <NotificationDropdown
        isOpen={isOpen}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDismissNotification={handleDismissNotification}
        onSelectNotification={handleSelectNotification}
        onClose={handleClose}
      />
    </div>
  );
});

NavActionControls.displayName = 'NavActionControls';
