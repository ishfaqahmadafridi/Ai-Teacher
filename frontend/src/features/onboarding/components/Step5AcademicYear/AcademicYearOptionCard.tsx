'use client';

import { memo } from 'react';
import { Card } from '@/components/ui/card';
import type { AcademicYearOptionCardProps } from '../../types';

export const AcademicYearOptionCard = memo(function AcademicYearOptionCard({
  year,
  selectedYear,
  onSelect,
}: AcademicYearOptionCardProps) {
  const isSelected = selectedYear === year.id;

  return (
    <Card
      onClick={() => onSelect(year.id)}
      className={`p-6 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex flex-col justify-between group ${
        isSelected
          ? 'bg-[#0043eb]/20 border-[#b8c3ff] shadow-[0_0_25px_rgba(0,67,235,0.3)] scale-[1.02]'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white font-['Montserrat',sans-serif]">
            {year.title}
          </h3>
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
              isSelected ? 'border-[#b8c3ff] bg-[#0043eb]' : 'border-white/30'
            }`}
          >
            {isSelected && <span className="text-white text-[10px] font-bold">✓</span>}
          </div>
        </div>
        <p className="text-xs text-[#c6c6cc] leading-relaxed">{year.subtitle}</p>
      </div>
    </Card>
  );
});

AcademicYearOptionCard.displayName = 'AcademicYearOptionCard';
