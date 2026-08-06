'use client';

import { SubjectItem } from '../../types';
import { Card } from '@/components/ui/card';

interface AllSubjectsSectionProps {
  items: SubjectItem[];
  selectedInterests: string[];
  onToggleInterest: (name: string) => void;
}

export function AllSubjectsSection({
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
              className={`p-4 rounded-xl flex flex-col items-start gap-2 text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#0043eb]/30 border border-[#b8c3ff] text-[#b8c3ff]'
                  : 'bg-white/5 border border-white/10 text-[#c6c6cc] hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold text-sm">{item.name}</span>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
