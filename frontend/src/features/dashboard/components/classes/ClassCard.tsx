'use client';

import { memo } from 'react';
import { Clock, Users, Video, CheckCircle2, Hourglass } from 'lucide-react';
import type { ClassCardProps } from '../../types/dashboard.types';

export const ClassCard = memo(function ClassCard({
  classItem,
  onJoinClass,
  className = '',
}: ClassCardProps) {
  const progress = classItem.progressPercent ?? 65;
  const completed = classItem.completedLessons ?? 13;
  const total = classItem.totalLessons ?? 20;
  const remaining = total - completed;
  const remainingPercent = 100 - progress;

  return (
    <div
      className={`bg-white rounded-2xl p-5 card-shadow border border-[#E2E8F0] flex flex-col justify-between hover:border-[#2563eb]/40 hover:shadow-md transition-all duration-300 group font-['Hanken_Grotesk',sans-serif] space-y-4 ${className}`}
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
        <div className="flex items-center justify-between text-xs text-[#737686] mb-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#737686]" aria-hidden="true" />
            <span>{classItem.timeFormatted}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#737686]" aria-hidden="true" />
            <span>{classItem.attendanceCount} Enrolled</span>
          </div>
        </div>

        {/* Schedule Completed vs Remaining Breakdown Box */}
        <div className="bg-[#F8FAFC] rounded-xl p-3.5 border border-[#E2E8F0]/70 space-y-2">
          <div className="flex items-center justify-between font-['JetBrains_Mono',monospace] text-xs">
            <span className="font-bold text-[#10B981] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" aria-hidden="true" />
              Completed: {completed} ({progress}%)
            </span>
            <span className="font-bold text-[#D97706] flex items-center gap-1">
              <Hourglass className="w-3.5 h-3.5 text-[#D97706]" aria-hidden="true" />
              Remaining: {remaining} ({remainingPercent}%)
            </span>
          </div>

          {/* Segmented Dual Progress Bar */}
          <div className="w-full bg-[#E2E8F0] rounded-full h-2.5 flex overflow-hidden">
            <div
              className="bg-[#2563eb] h-full rounded-l-full transition-all duration-500"
              style={{ width: `${progress}%` }}
              title={`Completed Schedule: ${progress}% (${completed} Classes)`}
            />
            <div
              className="bg-[#F59E0B] h-full rounded-r-full transition-all duration-500 opacity-80"
              style={{ width: `${remainingPercent}%` }}
              title={`Remaining Schedule: ${remainingPercent}% (${remaining} Classes)`}
            />
          </div>

          {classItem.timeRemaining && (
            <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[#737686] block text-right">
              {classItem.timeRemaining}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Action Row (Clean, No Teacher Pic) */}
      <div className="pt-3 border-t border-[#E2E8F0]/60 flex items-center justify-end">
        <button
          type="button"
          onClick={() => onJoinClass?.(classItem.id)}
          className="w-full sm:w-auto bg-[#2563eb] hover:bg-[#004ac6] text-white px-5 py-2.5 rounded-xl font-['Hanken_Grotesk',sans-serif] font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95 duration-200"
        >
          <Video className="w-4 h-4" aria-hidden="true" />
          <span>{classItem.isLive ? 'Join Live Room' : 'Enter Class'}</span>
        </button>
      </div>
    </div>
  );
});

ClassCard.displayName = 'ClassCard';
