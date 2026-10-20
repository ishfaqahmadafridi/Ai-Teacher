'use client';

import { memo } from 'react';
import { Bell } from 'lucide-react';
import type { NavNotificationButtonProps } from '../../../types/topbar.types';

export const NavNotificationButton = memo(function NavNotificationButton({
  unreadCount,
  onClick,
  className = '',
}: NavNotificationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open notifications"
      className={`relative dashboard-button dashboard-button-secondary dashboard-button-icon ${className}`}
    >
      <Bell className="w-4 h-4" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-dashboard-primary text-[9px] font-bold text-white flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
});

NavNotificationButton.displayName = 'NavNotificationButton';
