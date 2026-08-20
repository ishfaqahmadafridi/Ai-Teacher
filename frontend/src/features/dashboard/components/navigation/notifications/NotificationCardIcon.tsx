'use client';

import { memo } from 'react';
import { Clock, ClipboardList, Award } from 'lucide-react';
import type { NotificationCardIconProps } from '../../../types/topbar.types';

export const NotificationCardIcon = memo(function NotificationCardIcon({
  isDeadline,
  isGraded,
  iconStyles,
  className = '',
}: NotificationCardIconProps) {
  return (
    <div
      className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${iconStyles} ${className}`}
    >
      {isDeadline ? (
        <Clock className="w-4 h-4 text-[#F43F5E]" />
      ) : isGraded ? (
        <Award className="w-4 h-4 text-[#10B981]" />
      ) : (
        <ClipboardList className="w-4 h-4 text-[#8B5CF6]" />
      )}
    </div>
  );
});

NotificationCardIcon.displayName = 'NotificationCardIcon';
