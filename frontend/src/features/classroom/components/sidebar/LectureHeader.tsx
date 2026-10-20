'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { LectureHeaderProps } from '../../types/sidebar.types';
import { DEFAULT_LECTURE_TITLE } from '../../constants/sidebarConstants';

export const LectureHeader = memo(function LectureHeader({
  lectureTitle = DEFAULT_LECTURE_TITLE,
  subject = 'Physics Class',
  className = '',
}: LectureHeaderProps) {
  return (
    <div
      className={`p-4 border-b border-dashboard-border bg-dashboard-panel ${className}`}
    >
      {/* Lecture Header showing Project Logo, Active Status + Class Name Badge, & Topic Title */}
      <div className="flex items-center gap-3.5">
        {/* Official Project Main Logo */}
        <div className="relative w-10 h-10 shrink-0 p-1 rounded-xl bg-dashboard-subtle border border-dashboard-border shadow-md">
          <Image
            src="/neurolearn-brain-logo.png"
            alt="NEUROLEARN Project Main Logo"
            fill
            sizes="40px"
            className="object-contain rounded-lg p-0.5"
            priority
          />
        </div>

        {/* Active Status Badge + Class Subject + Dynamic Topic Title */}
        <div className="min-w-0 flex-1">
          {/* Active Status & Class Subject Pill */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-dashboard-success uppercase tracking-wider">
              Active • {subject}
            </span>
          </div>

          {/* Dynamic Topic Title */}
          <h3 className="text-base font-extrabold text-dashboard-text leading-snug font-['Hanken_Grotesk',sans-serif] tracking-tight line-clamp-2">
            {lectureTitle}
          </h3>
        </div>
      </div>
    </div>
  );
});

LectureHeader.displayName = 'LectureHeader';
