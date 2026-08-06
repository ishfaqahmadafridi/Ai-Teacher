'use client';

import { memo } from 'react';
import { Clock, Users, Video, BookOpenCheck } from 'lucide-react';
import type { ClassCardProps } from '../../types/dashboard.types';

export const ClassCard = memo(function ClassCard({
  classItem,
  onJoinClass,
  className = '',
}: ClassCardProps) {
  const progress = classItem.progressPercent ?? 50;
  const completed = classItem.completedLessons ?? 10;
  const total = classItem.totalLessons ?? 20;

  return (
    <div
      className={`bg-white rounded-2xl p-5 card-shadow border border-[#E2E8F0] flex flex-col justify-between hover:border-[#2563eb]/40 transition-all duration-300 group font-['Hanken_Grotesk',sans-serif] space-y-4 ${className}`}
    >
      <div>
        {/* Top Header: Subject Pill & Live Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold px-2.5 py-1 rounded-full bg-[#2563eb]/10 text-[#004ac6]">
            {classItem.subject}
          </span>
          {classItem.isLive ? (
            <span className="flex items-center gap-1.5 font-['JetBrains_Mono',monospace] text-[11px] font-bold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              Live Now
            </span>
          ) : (
            <span className="font-['JetBrains_Mono',monospace] text-[11px] font-medium text-[#737686] bg-[#F1F5F9] px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              Scheduled
            </span>
          )}
        </div>

        {/* Class Title */}
        <h3 className="font-['Hanken_Grotesk',sans-serif] text-base font-bold text-[#0F172A] mb-2 group-hover:text-[#004ac6] transition-colors leading-snug">
          {classItem.title}
        </h3>

        {/* Time & Attendance Info */}
        <div className="flex items-center gap-4 text-xs text-[#737686] mb-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#737686]" aria-hidden="true" />
            <span>{classItem.timeFormatted}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#737686]" aria-hidden="true" />
            <span>{classItem.attendanceCount} Enrolled</span>
          </div>
        </div>

        {/* Course Progress & Schedule Coverage Bar */}
        <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0]/70 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-['JetBrains_Mono',monospace] text-[11px] font-semibold text-[#0F172A] flex items-center gap-1">
              <BookOpenCheck className="w-3.5 h-3.5 text-[#2563eb]" aria-hidden="true" />
              Curriculum Progress
            </span>
            <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#2563eb]">
              {progress}% ({completed}/{total} Lessons)
            </span>
          </div>
          <div className="w-full bg-[#E2E8F0] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#2563eb] h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          {classItem.timeRemaining && (
            <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[#737686] block text-right">
              {classItem.timeRemaining}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Instructor Footer & Action Button */}
      <div className="pt-3 border-t border-[#E2E8F0]/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={classItem.instructorAvatar}
            alt={classItem.instructorName}
            className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0] shrink-0"
          />
          <span className="font-['Hanken_Grotesk',sans-serif] text-xs font-semibold text-[#475569] truncate">
            {classItem.instructorName}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onJoinClass?.(classItem.id)}
          className="bg-[#2563eb] hover:bg-[#004ac6] text-white px-4 py-2 rounded-lg font-['Hanken_Grotesk',sans-serif] font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95 duration-200"
        >
          <Video className="w-3.5 h-3.5" aria-hidden="true" />
          Join Class
        </button>
      </div>
    </div>
  );
});

ClassCard.displayName = 'ClassCard';
