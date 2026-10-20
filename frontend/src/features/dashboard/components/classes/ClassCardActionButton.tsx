'use client';

import { memo } from 'react';
import { Video } from 'lucide-react';
import type { ClassCardActionButtonProps } from '../../types/classes.types';

export const ClassCardActionButton = memo(function ClassCardActionButton({
  classItem,
  onJoinClass,
}: ClassCardActionButtonProps) {
  const handleClick = () => {
    if (classItem.isLive) {
      onJoinClass?.(classItem.id);
    } else {
      alert(
        `⏰ Class Not Live Yet:\n\n"${classItem.title}" is scheduled for ${classItem.timeFormatted}.\n\nLive room access opens 5 minutes before class starts. Please return at the scheduled time to enter!`
      );
    }
  };

  return (
    <div className="pt-3 border-t border-dashboard-border flex items-center justify-end">
      <button
        type="button"
        onClick={handleClick}
        className="dashboard-button dashboard-button-primary w-full sm:w-auto"
      >
        <Video className="w-4 h-4" aria-hidden="true" />
        <span>{classItem.isLive ? 'Join Live Room' : 'Join Session'}</span>
      </button>
    </div>
  );
});

ClassCardActionButton.displayName = 'ClassCardActionButton';
