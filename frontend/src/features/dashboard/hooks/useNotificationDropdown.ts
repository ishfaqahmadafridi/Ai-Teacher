'use client';

import { useState, useCallback, useMemo } from 'react';
import { DEFAULT_NOTIFICATIONS } from '../constants/notificationsConstants';
import type { NotificationItem, UseNotificationDropdownOptions } from '../types/topbar.types';

export function useNotificationDropdown(options: UseNotificationDropdownOptions = {}) {
  const { initialNotifications = DEFAULT_NOTIFICATIONS, onNotificationClick } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  }, []);

  const handleDismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleSelectNotification = useCallback(
    (notification: NotificationItem) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isUnread: false } : n))
      );
      setIsOpen(false);
      if (onNotificationClick) {
        onNotificationClick(notification);
      }
    },
    [onNotificationClick]
  );

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.isUnread).length;
  }, [notifications]);

  const dropdownProps = useMemo(
    () => ({
      isOpen,
      notifications,
      unreadCount,
      onMarkAllAsRead: handleMarkAllAsRead,
      onDismissNotification: handleDismissNotification,
      onSelectNotification: handleSelectNotification,
      onClose: handleClose,
    }),
    [
      isOpen,
      notifications,
      unreadCount,
      handleMarkAllAsRead,
      handleDismissNotification,
      handleSelectNotification,
      handleClose,
    ]
  );

  return {
    isOpen,
    notifications,
    unreadCount,
    dropdownProps,
    toggleOpen,
    handleClose,
    handleMarkAllAsRead,
    handleDismissNotification,
    handleSelectNotification,
  };
}
