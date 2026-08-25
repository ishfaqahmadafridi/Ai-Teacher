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
      className={`p-4 border-b border-slate-800/80 bg-gradient-to-b from-[#0F172A] via-[#0B132B]/80 to-transparent ${className}`}
    >
      {/* Lecture Header showing Project Logo, Active Status + Class Name Badge, & Topic Title */}
      <div className="flex items-center gap-3.5">
        {/* Official Project Main Logo */}
        <div className="relative w-10 h-10 shrink-0 p-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
          <Image
            src="/neurolearn-brain-logo.png"
            alt="NEUROLEARN Project Main Logo"
            fill
            sizes="40px"
            className="object-contain rounded-lg p-0.5"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(56,189,248,0.9))',
            }}
            priority
          />
        </div>

        {/* Active Status Badge + Class Subject + Dynamic Topic Title */}
        <div className="min-w-0 flex-1">
          {/* Active Status & Class Subject Pill */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Active • {subject}
            </span>
          </div>

          {/* Dynamic Topic Title */}
          <h3 className="text-base font-extrabold text-white leading-snug font-['Hanken_Grotesk',sans-serif] tracking-tight line-clamp-2">
            {lectureTitle}
          </h3>
        </div>
      </div>
    </div>
  );
});

LectureHeader.displayName = 'LectureHeader';
