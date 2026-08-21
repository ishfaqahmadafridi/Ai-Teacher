'use client';

import { memo } from 'react';
import { X } from 'lucide-react';
import { LessonNavigatorHeader } from '../lessons/LessonNavigatorHeader';
import type { MobileDrawerHeaderProps } from '../../../types/sidebar.types';

export const MobileDrawerHeader = memo(function MobileDrawerHeader({
  onClose,
  title = 'Lesson Navigator',
  moduleSubtitle = 'Module 4: Theoretical Physics',
  className = '',
}: MobileDrawerHeaderProps) {
  return (
    <div className={`flex items-center justify-between pr-4 ${className}`}>
      <LessonNavigatorHeader title={title} moduleSubtitle={moduleSubtitle} />
      <button
        type="button"
        onClick={onClose}
        className="p-2 text-[#c4c5d9] hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Close menu"
      >
        <X className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
});

MobileDrawerHeader.displayName = 'MobileDrawerHeader';
