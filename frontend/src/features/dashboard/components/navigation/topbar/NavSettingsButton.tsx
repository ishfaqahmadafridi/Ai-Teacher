'use client';

import { memo } from 'react';
import { Settings } from 'lucide-react';
import type { NavSettingsButtonProps } from '../../../types/topbar.types';

export const NavSettingsButton = memo(function NavSettingsButton({
  onClick,
  className = '',
}: NavSettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Settings and Profile"
      className={`p-2.5 rounded-2xl bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6]/50 text-[#94A3B8] hover:text-white transition-all ${className}`}
    >
      <Settings className="w-4 h-4" />
    </button>
  );
});

NavSettingsButton.displayName = 'NavSettingsButton';
