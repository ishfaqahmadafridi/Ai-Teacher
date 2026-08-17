'use client';

import { memo } from 'react';
import { Bell } from 'lucide-react';
import type { NavNotificationButtonProps } from '../../types/topbar.types';

export const NavNotificationButton = memo(function NavNotificationButton({
  unreadCount,
  onClick,
  className = '',
}: NavNotificationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Notifications"
      className={`relative p-2 text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer rounded-full hover:bg-[#1E293B] ${className}`}
    >
      <Bell className="w-5 h-5" aria-hidden="true" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#38BDF8] ring-2 ring-[#0A0F18]" />
      )}
    </button>
  );
});

NavNotificationButton.displayName = 'NavNotificationButton';
