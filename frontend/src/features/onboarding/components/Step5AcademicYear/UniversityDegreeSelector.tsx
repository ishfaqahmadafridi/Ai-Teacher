'use client';

import { memo } from 'react';
import { Check } from 'lucide-react';
import { universityDegreeTracks } from '../../types/academicYearData';
import type { UniversityDegreeSelectorProps } from '../../types';

export const UniversityDegreeSelector = memo(function UniversityDegreeSelector({
  selectedTrack,
  onSelectTrack,
  className = '',
}: UniversityDegreeSelectorProps) {
  return (
    <div className={`space-y-3 w-full font-['Hanken_Grotesk',sans-serif] ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-wide uppercase text-xs text-[#94A3B8]">
          Select University Degree Program
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
        {universityDegreeTracks.map((track) => {
          const isSelected = selectedTrack === track.id;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => onSelectTrack(track.id)}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-[#2563EB]/20 border-[#38BDF8] shadow-[0_0_20px_rgba(37,99,235,0.25)] scale-[1.02]'
                  : 'bg-[#070D1A]/80 border-[#1E293B] hover:bg-[#0F172A] hover:border-[#334155]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{track.icon}</span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? 'border-[#38BDF8] bg-[#2563EB]' : 'border-[#334155]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{track.title}</h4>
                <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-relaxed">{track.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});

UniversityDegreeSelector.displayName = 'UniversityDegreeSelector';
