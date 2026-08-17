'use client';

import { memo } from 'react';
import type { NavProfileAvatarButtonProps } from '../../types/topbar.types';

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
      className={`w-10 h-10 rounded-full overflow-hidden border border-[#1E293B] hover:border-[#38BDF8] shrink-0 transition-transform hover:scale-105 cursor-pointer ${className}`}
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
