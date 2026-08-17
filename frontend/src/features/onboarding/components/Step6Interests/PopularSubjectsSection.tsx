'use client';

import { memo } from 'react';
import { SubjectItem } from '../../types';
import { Button } from '@/components/ui/button';

interface PopularSubjectsSectionProps {
  items: SubjectItem[];
  selectedInterests: string[];
  onToggleInterest: (name: string) => void;
}

function PopularSubjectsSectionComponent({
  items,
  selectedInterests,
  onToggleInterest,
}: PopularSubjectsSectionProps) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#c6c6cc] mb-4">
        Popular Subjects
      </h3>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => {
          const isSelected = selectedInterests.includes(item.name);
          return (
            <Button
              key={item.name}
              type="button"
              variant="ghost"
              onClick={() => onToggleInterest(item.name)}
              className={`h-auto px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#0043eb]/30 border border-[#b8c3ff] text-[#b8c3ff] shadow-[0_0_15px_rgba(0,67,235,0.3)] hover:bg-[#0043eb]/40'
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <span>{item.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export const PopularSubjectsSection = memo(PopularSubjectsSectionComponent);
PopularSubjectsSection.displayName = 'PopularSubjectsSection';
