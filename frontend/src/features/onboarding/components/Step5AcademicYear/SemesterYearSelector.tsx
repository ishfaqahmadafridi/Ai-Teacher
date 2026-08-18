'use client';

import { memo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { semesterOptions } from '../../types/academicYearData';
import type { SemesterYearSelectorProps, AcademicYear } from '../../types';

const YEAR_PILLS: { id: AcademicYear; label: string }[] = [
  { id: 'freshman', label: 'Year 1 (Freshman)' },
  { id: 'sophomore', label: 'Year 2 (Sophomore)' },
  { id: 'junior', label: 'Year 3 (Junior)' },
  { id: 'senior', label: 'Year 4 (Senior)' },
];

export const SemesterYearSelector = memo(function SemesterYearSelector({
  selectedYear,
  onSelectYear,
  selectedSemester,
  onSelectSemester,
  className = '',
}: SemesterYearSelectorProps) {
  return (
    <div className={`p-5 rounded-2xl bg-[#070D1A]/80 border border-[#1E293B] space-y-5 w-full font-['Hanken_Grotesk',sans-serif] ${className}`}>
      {/* Academic Year Selection */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
          <Calendar className="w-4 h-4 text-[#38BDF8]" />
          <span>Academic Year Progression</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {YEAR_PILLS.map((pill) => {
            const isSelected = selectedYear === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => onSelectYear(pill.id)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                  isSelected
                    ? 'bg-[#2563EB]/20 border-[#38BDF8] text-white font-bold'
                    : 'bg-[#0F172A] border-[#1E293B] text-[#94A3B8] hover:text-white'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Semester / Term Selection */}
      <div className="space-y-2.5 pt-2 border-t border-[#1E293B]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
          <Clock className="w-4 h-4 text-[#C4B5FD]" />
          <span>Current Term / Semester</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {semesterOptions.map((sem) => {
            const isSelected = selectedSemester === sem.id;
            return (
              <button
                key={sem.id}
                type="button"
                onClick={() => onSelectSemester(sem.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#8B5CF6]/20 border-[#C4B5FD] text-white font-bold'
                    : 'bg-[#0F172A] border-[#1E293B] text-[#94A3B8] hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{sem.label}</div>
                <div className="text-[11px] opacity-70 mt-0.5">{sem.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

SemesterYearSelector.displayName = 'SemesterYearSelector';
