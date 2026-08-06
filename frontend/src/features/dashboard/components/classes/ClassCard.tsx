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
      className={`bg-[#0F172A]/90 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-[#1E293B] flex flex-col justify-between hover:border-[#38BDF8]/40 transition-all duration-300 group font-['Hanken_Grotesk',sans-serif] space-y-4 ${className}`}
    >
      <div>
        {/* Top Header: Subject Pill & Live Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold px-2.5 py-1 rounded-full bg-[#2563eb]/20 text-[#38BDF8] border border-[#2563eb]/30">
            {classItem.subject}
          </span>
          {classItem.isLive ? (
            <span className="flex items-center gap-1.5 font-['JetBrains_Mono',monospace] text-[11px] font-bold text-[#10B981] bg-[#10B981]/20 border border-[#10B981]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              Live Now
            </span>
          ) : (
            <span className="font-['JetBrains_Mono',monospace] text-[11px] font-medium text-[#94A3B8] bg-[#1E293B] px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              Scheduled
            </span>
          )}
        </div>

        {/* Class Title */}
        <h3 className="font-['Hanken_Grotesk',sans-serif] text-base font-bold text-white mb-2 group-hover:text-[#38BDF8] transition-colors leading-snug">
          {classItem.title}
        </h3>

        {/* Time & Attendance Info */}
        <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#94A3B8]" aria-hidden="true" />
            <span>{classItem.timeFormatted}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#94A3B8]" aria-hidden="true" />
            <span>{classItem.attendanceCount} Enrolled</span>
          </div>
        </div>

        {/* Schedule Completed vs Remaining Breakdown Box */}
        <div className="bg-[#0B132B]/80 rounded-xl p-3.5 border border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between font-['JetBrains_Mono',monospace] text-xs">
            <span className="font-bold text-[#10B981] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" aria-hidden="true" />
              Completed: {completed} ({progress}%)
            </span>
            <span className="font-bold text-[#F59E0B] flex items-center gap-1">
              <Hourglass className="w-3.5 h-3.5 text-[#F59E0B]" aria-hidden="true" />
              Remaining: {remaining} ({remainingPercent}%)
            </span>
          </div>

          {/* Segmented Dual Progress Bar */}
          <div className="w-full bg-[#1E293B] rounded-full h-2.5 flex overflow-hidden">
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
            <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[#94A3B8] block text-right">
              {classItem.timeRemaining}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Action Row (Clean, No Teacher Pic) */}
      <div className="pt-3 border-t border-[#1E293B] flex items-center justify-end">
        <button
          type="button"
          onClick={() => onJoinClass?.(classItem.id)}
          className="w-full sm:w-auto bg-[#2563eb] hover:bg-[#004ac6] text-white px-5 py-2.5 rounded-xl font-['Hanken_Grotesk',sans-serif] font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95 duration-200"
        >
          <Video className="w-4 h-4" aria-hidden="true" />
          <span>{classItem.isLive ? 'Join Live Room' : 'Enter Class'}</span>
        </button>
      </div>
    </div>
  );
});

ClassCard.displayName = 'ClassCard';
