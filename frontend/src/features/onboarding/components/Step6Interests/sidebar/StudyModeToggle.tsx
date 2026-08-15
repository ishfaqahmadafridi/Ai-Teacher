'use client';

import { memo } from 'react';
import { Clock, BookOpen } from 'lucide-react';
import type { StudyModeToggleProps } from '../../../types';

export const StudyModeToggle = memo(function StudyModeToggle({
  studyMode,
  modeDescription,
  onToggleStudyMode,
}: StudyModeToggleProps) {
  return (
    <div className="space-y-3 relative z-10">
      <div className="space-y-2">
        <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
          Select Study Mode
        </span>
        <div className="grid grid-cols-2 gap-1.5 bg-[#0A1120] p-1 rounded-2xl border border-[#1E293B]">
          <button
            type="button"
            onClick={() => onToggleStudyMode('timetable')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              studyMode === 'timetable'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timetable</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleStudyMode('self_paced')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              studyMode === 'self_paced'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Self-Paced</span>
          </button>
        </div>
      </div>

      <div className="p-3 bg-[#0A1120] rounded-xl border border-[#1E293B] text-[11px] text-[#38BDF8] font-medium leading-relaxed">
        {modeDescription}
      </div>
    </div>
  );
});

StudyModeToggle.displayName = 'StudyModeToggle';
