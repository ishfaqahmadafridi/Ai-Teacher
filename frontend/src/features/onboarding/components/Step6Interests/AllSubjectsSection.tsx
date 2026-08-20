'use client';

import { memo } from 'react';
import { Card } from '@/components/ui/card';
import type { AllSubjectsSectionProps } from '../../types/onboarding.types';

export const AllSubjectsSection = memo(function AllSubjectsSection({
  items,
  selectedInterests,
  onToggleInterest,
}: AllSubjectsSectionProps) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#c6c6cc] mb-4">All Subjects</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item) => {
          const isSelected = selectedInterests.includes(item.name);
          return (
            <Card
              key={item.name}
              onClick={() => onToggleInterest(item.name)}
              className={`p-4 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#0043eb]/30 border border-[#b8c3ff] text-white shadow-lg shadow-[#0043eb]/20'
                  : 'bg-white/5 border border-white/10 text-[#c6c6cc] hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="font-semibold text-sm">{item.name}</span>
              {isSelected && <span className="text-[#38BDF8] text-xs font-bold">✓</span>}
            </Card>
          );
        })}
      </div>
    </div>
  );
});

AllSubjectsSection.displayName = 'AllSubjectsSection';
