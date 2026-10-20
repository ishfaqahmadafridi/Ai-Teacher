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
      className={`dashboard-button dashboard-button-secondary dashboard-button-icon ${className}`}
    >
      <Settings className="w-4 h-4" />
    </button>
  );
});

NavSettingsButton.displayName = 'NavSettingsButton';
