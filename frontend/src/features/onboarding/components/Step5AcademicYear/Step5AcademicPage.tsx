'use client';

import { useState, memo } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { highSchoolYears, universityYears } from '../../types';
import { Step5AcademicLayout } from './Step5AcademicLayout';
import { AcademicHeader } from './AcademicHeader';
import { AcademicLevelToggle } from './AcademicLevelToggle';
import { AcademicYearGrid } from './AcademicYearGrid';
import { GrowthTrajectoryCard } from './GrowthTrajectoryCard';
import { SkipStepButton } from '../SkipStepButton';

export const Step5AcademicPage = memo(function Step5AcademicPage() {
  const {
    error, academicYear, selectAcademicYear } = useOnboarding();
  const [levelMode, setLevelMode] = useState<'high_school' | 'university'>('university');

  const currentYears = levelMode === 'high_school' ? highSchoolYears : universityYears;

  return (
    <Step5AcademicLayout>
      {error && <p role="alert">{error}</p>}
      <AcademicHeader />
      <AcademicLevelToggle levelMode={levelMode} onToggleLevel={setLevelMode} />
      
      <AcademicYearGrid
        years={currentYears}
        selectedYear={academicYear}
        onSelectYear={selectAcademicYear}
      />

      <GrowthTrajectoryCard />
      <div className="flex justify-end"><SkipStepButton step={5} /></div>
    </Step5AcademicLayout>
  );
});

Step5AcademicPage.displayName = 'Step5AcademicPage';
