'use client';

import { memo } from 'react';
import { Calendar, Sparkles, Plus } from 'lucide-react';
import { ScheduleViewModeToggle } from './ScheduleViewModeToggle';
import type { ScheduleHeaderBannerProps } from '../../types/schedule.types';

export const ScheduleHeaderBanner = memo(function ScheduleHeaderBanner({
  viewMode,
  onViewModeChange,
  onOpenAiPlanner,
  onOpenManualCreate,
  className = '',
}: ScheduleHeaderBannerProps) {
  return (
    <div
      className={`bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-[#1E293B] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 ${className}`}
    >
      <div className="absolute right-0 top-0 w-80 h-full bg-[#2563EB]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2563EB]/20 text-[#38BDF8] text-xs font-bold uppercase tracking-wider mb-2.5 border border-[#2563EB]/30">
          <Calendar className="w-4 h-4 text-[#38BDF8]" />
          <span>Weekly Class Timetable</span>
        </div>
        <h2 className="font-['Hanken_Grotesk',sans-serif] text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
          Class Schedule & Time Slots
        </h2>
        <p className="font-['Hanken_Grotesk',sans-serif] text-sm text-[#94A3B8] mt-2 leading-relaxed">
          Select a day on the left to view time slots, or switch to full weekly matrix view.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-3">
        {onOpenManualCreate && (
          <button
            type="button"
            onClick={onOpenManualCreate}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-blue-400" />
            <span>Manual Create</span>
          </button>
        )}

        {onOpenAiPlanner && (
          <button
            type="button"
            onClick={onOpenAiPlanner}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>AI Smart Planner</span>
          </button>
        )}

        <ScheduleViewModeToggle
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>
    </div>
  );
});


ScheduleHeaderBanner.displayName = 'ScheduleHeaderBanner';
