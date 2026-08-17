'use client';

import { useMemo, useCallback } from 'react';
import { getNotificationCardStyles, getNotificationIconStyles } from '../utilities/notificationUtils';
import type { NotificationItem } from '../types/topbar.types';

export function useNotificationCardItem(
  notification: NotificationItem,
  onDismiss: (id: string) => void,
  onSelect?: (notification: NotificationItem) => void
) {
  const isDeadline = useMemo(() => notification.type === 'deadline_reminder', [notification.type]);
  const isGraded = useMemo(() => notification.type === 'graded', [notification.type]);

  const cardStyles = useMemo(
    () => getNotificationCardStyles(notification.isUnread, isDeadline),
    [notification.isUnread, isDeadline]
  );

  const iconStyles = useMemo(
    () => getNotificationIconStyles(notification.type),
    [notification.type]
  );

  const handleDismiss = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDismiss(notification.id);
    },
    [notification.id, onDismiss]
  );

  const handleCardClick = useCallback(() => {
    if (onSelect) {
      onSelect(notification);
    }
  }, [notification, onSelect]);

  return {
    isDeadline,
    isGraded,
    cardStyles,
    iconStyles,
    handleDismiss,
    handleCardClick,
  };
}
