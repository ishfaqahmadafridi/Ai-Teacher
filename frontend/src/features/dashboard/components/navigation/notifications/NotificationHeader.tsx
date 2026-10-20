'use client';

import { memo } from 'react';
import { Bell, CheckCheck, X } from 'lucide-react';
import type { NotificationHeaderProps } from '../../../types/topbar.types';

export const NotificationHeader = memo(function NotificationHeader({
  unreadCount,
  onMarkAllAsRead,
  onClose,
  className = '',
}: NotificationHeaderProps) {
  return (
    <div className={`flex items-center justify-between border-b border-dashboard-border pb-3 px-1 ${className}`}>
      <div className="flex items-center gap-2">
        <Bell className="w-4 h-4 text-dashboard-primary" />
        <h3 className="text-sm font-bold text-dashboard-text">Notifications</h3>
        {unreadCount > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-dashboard-primary/10 text-dashboard-primary text-[10px] font-bold border border-dashboard-primary/20">
            {unreadCount} new
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-[11px] font-semibold text-dashboard-primary hover:text-dashboard-primary flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark read
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification panel"
          className="text-dashboard-muted hover:text-dashboard-text p-1 rounded-lg hover:bg-dashboard-subtle transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

NotificationHeader.displayName = 'NotificationHeader';
