'use client';

import { memo } from 'react';
import { Bell, Lock } from 'lucide-react';
import type { ProfileNotificationTogglesProps } from '../../types/profile.types';

export const ProfileNotificationToggles = memo(function ProfileNotificationToggles({
  className = '',
}: ProfileNotificationTogglesProps) {
  return (
    <div className={`bg-dashboard-subtle/60 p-4 rounded-xl border border-dashboard-border space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Bell className="w-4 h-4 text-dashboard-primary" />
          <span className="text-sm font-medium text-dashboard-text">Class Reminders & Live Alerts</span>
        </div>
        <input
          type="checkbox"
          defaultChecked
          aria-label="Class Reminders & Live Alerts Toggle"
          className="w-4 h-4 accent-dashboard-primary cursor-pointer"
        />
      </div>
      <div className="flex items-center justify-between border-t border-dashboard-border pt-3">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-dashboard-primary" />
          <span className="text-sm font-medium text-dashboard-text">Two-Factor Authentication (2FA)</span>
        </div>
        <input
          type="checkbox"
          defaultChecked
          aria-label="Two-Factor Authentication Toggle"
          className="w-4 h-4 accent-dashboard-primary cursor-pointer"
        />
      </div>
    </div>
  );
});

ProfileNotificationToggles.displayName = 'ProfileNotificationToggles';
