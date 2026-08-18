'use client';

import { memo } from 'react';
import { AcademicYearOptionCard } from './AcademicYearOptionCard';
import type { AcademicYearGridProps } from '../../types';

function AcademicYearGridComponent({
  years,
  selectedYear,
  onSelectYear,
}: AcademicYearGridProps) {
  const isFiveItems = years.length === 5;

  return (
    <div
      className={`grid gap-3.5 w-full ${
        isFiveItems
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      }`}
    >
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
