'use client';

import { memo } from 'react';
import { AcademicYearOptionCard } from './AcademicYearOptionCard';
import type { AcademicYearGridProps } from '../../types';

function AcademicYearGridComponent({
  years,
  selectedYear,
  onSelectYear,
}: AcademicYearGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {years.map((year) => (
        <AcademicYearOptionCard
          key={year.id}
          year={year}
          selectedYear={selectedYear}
          onSelect={onSelectYear}
        />
      ))}
    </div>
  );
}

export const AcademicYearGrid = memo(AcademicYearGridComponent);
AcademicYearGrid.displayName = 'AcademicYearGrid';
