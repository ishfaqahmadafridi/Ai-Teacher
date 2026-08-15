'use client';

import { memo } from 'react';
import type { CategorizedSubjectsSectionProps } from '../../types';
import { Button } from '@/components/ui/button';

function CategorizedSubjectsSectionComponent({
  categories,
  searchQuery,
  selectedInterests,
  onToggleInterest,
}: CategorizedSubjectsSectionProps) {
  const query = searchQuery.trim().toLowerCase();

  return (
    <div className="space-y-8 font-['Hanken_Grotesk',sans-serif]">
      {categories.map((cat) => {
        const filteredItems = query
          ? cat.items.filter((item) => item.name.toLowerCase().includes(query))
          : cat.items;

        if (filteredItems.length === 0) return null;

        return (
          <div key={cat.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#c6c6cc]">
                {cat.title}
              </h3>
              <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {cat.badge}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {filteredItems.map((item) => {
                const isSelected = selectedInterests.includes(item.name);
                return (
                  <Button
                    key={item.name}
                    type="button"
                    variant="ghost"
                    onClick={() => onToggleInterest(item.name)}
                    className={`h-auto px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2563EB] text-white border border-[#60A5FA] shadow-lg shadow-[#2563eb]/40 scale-[1.02]'
                        : 'bg-[#0F172A]/80 border border-[#1E293B] text-[#94A3B8] hover:bg-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span>{item.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const CategorizedSubjectsSection = memo(CategorizedSubjectsSectionComponent);
CategorizedSubjectsSection.displayName = 'CategorizedSubjectsSection';
