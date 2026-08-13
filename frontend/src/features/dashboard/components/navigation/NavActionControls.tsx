'use client';

import { memo } from 'react';
import { useNotificationDropdown } from '../../hooks';
import { NotificationDropdown } from './NotificationDropdown';
import { NavNotificationButton } from './NavNotificationButton';
import { NavSettingsButton } from './NavSettingsButton';
import { NavProfileAvatarButton } from './NavProfileAvatarButton';
import type { NavActionControlsProps } from '../../types/topbar.types';

export const NavActionControls = memo(function NavActionControls({
  studentAvatar,
  onOpenProfile,
  onNotificationClick,
  className = '',
}: NavActionControlsProps) {
  const { unreadCount, toggleOpen, dropdownProps } = useNotificationDropdown({ onNotificationClick });

  return (
    <div className={`relative flex items-center gap-4 ${className}`}>
      {/* Notifications Icon Button & Popover Dropdown */}
      <NavNotificationButton unreadCount={unreadCount} onClick={toggleOpen} />
      <NotificationDropdown {...dropdownProps} />

      {/* Settings & Profile Avatar Action Buttons */}
      <NavSettingsButton onClick={onOpenProfile} />
      <NavProfileAvatarButton studentAvatar={studentAvatar} onClick={onOpenProfile} />
    </div>
  );
});

NavActionControls.displayName = 'NavActionControls';
