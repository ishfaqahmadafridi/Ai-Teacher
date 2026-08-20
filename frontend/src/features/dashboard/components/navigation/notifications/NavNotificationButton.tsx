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
      className={`relative p-2.5 rounded-2xl bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6]/50 text-[#94A3B8] hover:text-white transition-all ${className}`}
    >
      <Bell className="w-4 h-4" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8B5CF6] text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
});

NavNotificationButton.displayName = 'NavNotificationButton';
