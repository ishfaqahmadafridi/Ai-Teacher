'use client';

import { memo } from 'react';
import type { UserAvatarBadgeProps } from '../../../types/sidebar.types';

export const UserAvatarBadge = memo(function UserAvatarBadge({
  studentAvatar,
  studentName,
}: UserAvatarBadgeProps) {
  return (
    <div className="relative shrink-0">
      {/* Gradient ring */}
      <div
        className="w-24 h-24 rounded-full p-[3.5px] shadow-xl shadow-[#7C3AED]/30"
        style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0F18]">
          <img
            src={studentAvatar}
            alt={studentName}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Online status indicator dot */}
      <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#10B981] border-2 border-[#030712] shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
    </div>
  );
});

UserAvatarBadge.displayName = 'UserAvatarBadge';
