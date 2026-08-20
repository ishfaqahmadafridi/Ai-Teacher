'use client';

import { memo } from 'react';
import { EducationOptionCard } from './EducationOptionCard';
import { educationLevels } from '../../types';
import type { EducationLevelsGridProps } from '../../types/onboarding.types';

export const EducationGrid = memo(function EducationGrid({ selectedLevel, onSelectLevel }: EducationLevelsGridProps) {
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
});

EducationGrid.displayName = 'EducationGrid';
