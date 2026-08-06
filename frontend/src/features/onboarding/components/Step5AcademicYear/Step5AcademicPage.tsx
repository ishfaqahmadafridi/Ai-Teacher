'use client';

import { useState } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { highSchoolYears, universityYears } from '../../types';
import { Step5AcademicLayout } from './Step5AcademicLayout';
import { AcademicLevelToggle } from './AcademicLevelToggle';
import { AcademicYearGrid } from './AcademicYearGrid';
import { GrowthTrajectoryCard } from './GrowthTrajectoryCard';

export function Step5AcademicPage() {
  const { academicYear, selectAcademicYear } = useOnboarding();
  const [levelMode, setLevelMode] = useState<'high_school' | 'university'>('university');

  const currentYears = levelMode === 'high_school' ? highSchoolYears : universityYears;

  return (
    <Step5AcademicLayout>
      <AcademicLevelToggle levelMode={levelMode} onToggle={setLevelMode} />
      
      <AcademicYearGrid
        years={currentYears}
        selectedYear={academicYear}
        onSelectYear={selectAcademicYear}
      />

      <GrowthTrajectoryCard />
    </Step5AcademicLayout>
  );
}
