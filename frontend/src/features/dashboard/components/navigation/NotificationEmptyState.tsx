'use client';

import { memo } from 'react';
import type { NotificationEmptyStateProps } from '../../types/topbar.types';

export const NotificationEmptyState = memo(function NotificationEmptyState({
  message = 'No notifications available.',
  className = '',
}: NotificationEmptyStateProps) {
  return (
    <div className={`p-6 text-center text-xs text-[#64748B] ${className}`}>
      {message}
    </div>
  );
});

NotificationEmptyState.displayName = 'NotificationEmptyState';
