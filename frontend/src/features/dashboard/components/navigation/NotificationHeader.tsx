'use client';

import { memo } from 'react';
import { Bell, CheckCheck, X } from 'lucide-react';
import type { NotificationHeaderProps } from '../../types/topbar.types';

export const NotificationHeader = memo(function NotificationHeader({
  unreadCount,
  onMarkAllAsRead,
  onClose,
  className = '',
}: NotificationHeaderProps) {
  return (
    <div className={`flex items-center justify-between border-b border-[#1E293B] pb-3 px-1 ${className}`}>
      <div className="flex items-center gap-2">
        <Bell className="w-4 h-4 text-[#38BDF8]" />
        <h4 className="font-bold text-sm text-white">Notifications</h4>
        {unreadCount > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] text-[11px] font-extrabold border border-[#38BDF8]/30">
            {unreadCount} New
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-[11px] font-semibold text-[#8B5CF6] hover:text-[#C4B5FD] flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-[#1E293B] cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-[#64748B] hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

NotificationHeader.displayName = 'NotificationHeader';
