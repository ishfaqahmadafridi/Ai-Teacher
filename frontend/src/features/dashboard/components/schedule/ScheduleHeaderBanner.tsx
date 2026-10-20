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
      className={`bg-dashboard-panel border border-dashboard-border rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-none flex flex-col md:flex-row md:items-center justify-between gap-6 ${className}`}
    >
      <div className="absolute right-0 top-0 w-80 h-full bg-dashboard-primary/10 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dashboard-primary/20 text-dashboard-primary text-xs font-bold uppercase tracking-wider mb-2.5 border border-dashboard-primary/30">
          <Calendar className="w-4 h-4 text-dashboard-primary" />
          <span>Weekly Class Timetable</span>
        </div>
        <h2 className="font-['Hanken_Grotesk',sans-serif] text-2xl sm:text-3xl font-black text-dashboard-text tracking-tight leading-tight">
          Class Schedule & Time Slots
        </h2>
        <p className="font-['Hanken_Grotesk',sans-serif] text-sm text-dashboard-muted mt-2 leading-relaxed">
          Select a day on the left to view time slots, or switch to full weekly matrix view.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-3">
        {onOpenManualCreate && (
          <button
            type="button"
            onClick={onOpenManualCreate}
            className="dashboard-button dashboard-button-secondary"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Manual Create</span>
          </button>
        )}

        {onOpenAiPlanner && (
          <button
            type="button"
            onClick={onOpenAiPlanner}
            className="dashboard-button dashboard-button-secondary"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
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
