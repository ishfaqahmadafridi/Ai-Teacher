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
    <div className="pt-3 border-t border-[#1E293B] flex items-center justify-end">
      <button
        type="button"
        onClick={handleClick}
        className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-['Hanken_Grotesk',sans-serif] font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95 duration-200 ${
          classItem.isLive
            ? 'bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-[#EF4444]/30 animate-pulse'
            : 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'
        }`}
      >
        <Video className="w-4 h-4" aria-hidden="true" />
        <span>{classItem.isLive ? 'Join Live Room' : 'Join Session'}</span>
      </button>
    </div>
  );
});

ClassCardActionButton.displayName = 'ClassCardActionButton';
