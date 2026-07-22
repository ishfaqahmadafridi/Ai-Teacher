'use client';

import { Card } from '@/components/ui/card';
import { LevelOption, EducationLevel } from '../../types';

interface EducationOptionCardProps {
  option: LevelOption;
  selectedLevel: EducationLevel | null;
  onSelect: (id: EducationLevel) => void;
}

export function EducationOptionCard({ option, selectedLevel, onSelect }: EducationOptionCardProps) {
  const isSelected = selectedLevel === option.id;

  return (
    <Card
      onClick={() => onSelect(option.id)}
      className={`p-6 rounded-2xl cursor-pointer flex flex-col items-center text-center border transition-all duration-300 group ${option.span || ''} ${
        isSelected
          ? 'bg-[#0043eb]/20 border-[#b8c3ff] shadow-[0_0_30px_rgba(0,67,235,0.3)] scale-[1.02]'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1'
      }`}
    >
      <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
        {option.icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-1.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {option.title}
      </h3>
      <p className="text-xs text-[#c6c6cc] leading-relaxed">
        {option.description}
      </p>
    </Card>
  );
}
