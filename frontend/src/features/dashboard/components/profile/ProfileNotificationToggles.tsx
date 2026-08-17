'use client';

import { memo } from 'react';
import { Bell, Lock } from 'lucide-react';
import type { ProfileNotificationTogglesProps } from '../../types/profile.types';

export const ProfileNotificationToggles = memo(function ProfileNotificationToggles({
  className = '',
}: ProfileNotificationTogglesProps) {
  return (
    <div className={`bg-[#1E293B]/60 p-4 rounded-xl border border-[#334155] space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Bell className="w-4 h-4 text-[#38BDF8]" />
          <span className="text-sm font-medium text-white">Class Reminders & Live Alerts</span>
        </div>
        <input
          type="checkbox"
          defaultChecked
          aria-label="Class Reminders & Live Alerts Toggle"
          className="w-4 h-4 accent-[#2563EB] cursor-pointer"
        />
      </div>
      <div className="flex items-center justify-between border-t border-[#334155] pt-3">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-[#38BDF8]" />
          <span className="text-sm font-medium text-white">Two-Factor Authentication (2FA)</span>
        </div>
        <input
          type="checkbox"
          defaultChecked
          aria-label="Two-Factor Authentication Toggle"
          className="w-4 h-4 accent-[#2563EB] cursor-pointer"
        />
      </div>
    </div>
  );
});

ProfileNotificationToggles.displayName = 'ProfileNotificationToggles';
