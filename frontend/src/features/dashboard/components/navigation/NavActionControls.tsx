'use client';

import { memo } from 'react';
import { Bell, Settings } from 'lucide-react';
import type { NavActionControlsProps } from '../../types/topbar.types';

export const NavActionControls = memo(function NavActionControls({
  unreadNotificationsCount = 2,
  studentAvatar,
  onOpenProfile,
  className = '',
}: NavActionControlsProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button
        type="button"
        aria-label="Notifications"
        className="relative p-2 text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer rounded-full hover:bg-[#1E293B]"
      >
        <Bell className="w-5 h-5" aria-hidden="true" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1 right-[#1] w-2 h-2 rounded-full bg-[#38BDF8]" />
        )}
      </button>
      <button
        type="button"
        onClick={onOpenProfile}
        aria-label="Settings and Profile"
        className="p-2 text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer rounded-full hover:bg-[#1E293B]"
      >
        <Settings className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Student Profile Avatar Button */}
      <button
        type="button"
        onClick={onOpenProfile}
        aria-label="View Student Profile"
        className="w-10 h-10 rounded-full overflow-hidden border border-[#1E293B] hover:border-[#38BDF8] shrink-0 transition-transform hover:scale-105 cursor-pointer"
      >
        <img
          src={studentAvatar}
          alt="Student Avatar"
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
});

NavActionControls.displayName = 'NavActionControls';
