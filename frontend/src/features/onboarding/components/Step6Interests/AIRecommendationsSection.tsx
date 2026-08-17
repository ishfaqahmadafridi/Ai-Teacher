'use client';

import { memo } from 'react';
import { SubjectItem } from '../../types';
import { Button } from '@/components/ui/button';

interface AIRecommendationsSectionProps {
  items: SubjectItem[];
  selectedInterests: string[];
  onToggleInterest: (name: string) => void;
}

function AIRecommendationsSectionComponent({
  items,
  selectedInterests,
  onToggleInterest,
}: AIRecommendationsSectionProps) {
  return (
    <div className="p-6 rounded-2xl border border-[#0043eb]/30 bg-[#0043eb]/5 backdrop-blur-xl">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#00d2ff] mb-4">
        AI Recommendations for You
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
                  ? 'bg-[#0043eb]/30 border border-[#ddb7ff] text-[#ddb7ff] shadow-[0_0_15px_rgba(221,183,255,0.4)] hover:bg-[#0043eb]/40'
                  : 'bg-white/5 border border-[#ddb7ff]/30 text-white hover:bg-white/10'
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

export const AIRecommendationsSection = memo(AIRecommendationsSectionComponent);
AIRecommendationsSection.displayName = 'AIRecommendationsSection';
