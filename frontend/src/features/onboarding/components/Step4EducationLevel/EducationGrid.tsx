'use client';

import { EducationOptionCard } from './EducationOptionCard';
import { educationLevels, EducationLevel } from '../../types';

interface EducationGridProps {
  selectedLevel: EducationLevel | null;
  onSelectLevel: (level: EducationLevel) => void;
}

export function EducationGrid({ selectedLevel, onSelectLevel }: EducationGridProps) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {educationLevels.map((option) => (
        <EducationOptionCard
          key={option.id}
          option={option}
          selectedLevel={selectedLevel}
          onSelect={onSelectLevel}
        />
      ))}
    </div>
  );
}
