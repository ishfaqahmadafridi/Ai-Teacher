'use client';

import { memo } from 'react';
import { Video, Clock3 } from 'lucide-react';
import type { ScheduleItemCardActionButtonProps } from '../../types/schedule.types';

export const ScheduleItemCardActionButton = memo(function ScheduleItemCardActionButton({
  isLive,
  onClick,
  isJoinAvailable = isLive,
}: ScheduleItemCardActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`dashboard-button w-full md:w-auto shrink-0 relative z-10 ${isJoinAvailable ? 'dashboard-button-join' : 'dashboard-button-secondary'}`}
    >
      {isJoinAvailable ? <Video className="h-4 w-4" aria-hidden="true" /> : <Clock3 className="h-4 w-4" aria-hidden="true" />}
      <span>{isJoinAvailable ? 'Join class' : 'View time'}</span>
    </button>
  );
});

ScheduleItemCardActionButton.displayName = 'ScheduleItemCardActionButton';
