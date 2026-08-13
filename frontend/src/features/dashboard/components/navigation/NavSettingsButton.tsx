'use client';

import { memo } from 'react';
import { Settings } from 'lucide-react';
import type { NavSettingsButtonProps } from '../../types/topbar.types';

export const NavSettingsButton = memo(function NavSettingsButton({
  onClick,
  className = '',
}: NavSettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Settings and Profile"
      className={`p-2 text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer rounded-full hover:bg-[#1E293B] ${className}`}
    >
      <Settings className="w-5 h-5" aria-hidden="true" />
    </button>
  );
});

NavSettingsButton.displayName = 'NavSettingsButton';
