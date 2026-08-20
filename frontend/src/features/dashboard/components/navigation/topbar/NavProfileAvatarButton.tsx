'use client';

import { memo } from 'react';
import type { NavProfileAvatarButtonProps } from '../../../types/topbar.types';

export const NavProfileAvatarButton = memo(function NavProfileAvatarButton({
  studentAvatar,
  onClick,
  className = '',
}: NavProfileAvatarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="View Student Profile"
      className={`relative w-10 h-10 rounded-2xl overflow-hidden ring-2 ring-[#1E293B] hover:ring-[#8B5CF6] transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] ${className}`}
    >
      <img
        src={studentAvatar}
        alt="Student Avatar"
        className="w-full h-full object-cover"
      />
    </button>
  );
});

NavProfileAvatarButton.displayName = 'NavProfileAvatarButton';
