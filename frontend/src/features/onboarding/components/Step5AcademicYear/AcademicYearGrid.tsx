'use client';

import { AcademicYearOptionCard } from './AcademicYearOptionCard';
import { YearOption, AcademicYear } from '../../types';

interface AcademicYearGridProps {
  years: YearOption[];
  selectedYear: AcademicYear | null;
  onSelectYear: (year: AcademicYear) => void;
}

export function AcademicYearGrid({ years, selectedYear, onSelectYear }: AcademicYearGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-16">
      {years.map((yr) => (
        <AcademicYearOptionCard
          key={yr.id}
          year={yr}
          selectedYear={selectedYear}
          onSelect={onSelectYear}
        />
      ))}
    </div>
  );
}
