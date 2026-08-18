'use client';

import { useState, memo } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import {
  primaryYears,
  middleYears,
  highSchoolYears,
  universityYears,
  postgraduateYears,
  professionalYears,
  selfLearnerYears,
} from '../../types';
import type { AcademicYearMode, YearOption } from '../../types';
import { Step5AcademicLayout } from './Step5AcademicLayout';
import { AcademicHeader } from './AcademicHeader';
import { AcademicLevelToggle } from './AcademicLevelToggle';
import { AcademicYearGrid } from './AcademicYearGrid';
import { GrowthTrajectoryCard } from './GrowthTrajectoryCard';

const YEAR_DATA_MAP: Record<AcademicYearMode, YearOption[]> = {
  primary: primaryYears,
  middle: middleYears,
  high_school: highSchoolYears,
  undergraduate: universityYears,
  postgraduate: postgraduateYears,
  professional: professionalYears,
  self_learner: selfLearnerYears,
};

export const Step5AcademicPage = memo(function Step5AcademicPage() {
  const { educationLevel, academicYear, selectAcademicYear } = useOnboarding();
  const [levelMode, setLevelMode] = useState<AcademicYearMode>(
    educationLevel || 'undergraduate'
  );

  const currentYears = YEAR_DATA_MAP[levelMode] || universityYears;

  return (
    <Step5AcademicLayout>
      <AcademicHeader />
      <AcademicLevelToggle levelMode={levelMode} onToggleLevel={setLevelMode} />
      
      <AcademicYearGrid
        years={currentYears}
        selectedYear={academicYear}
        onSelectYear={selectAcademicYear}
      />

      <GrowthTrajectoryCard />
    </Step5AcademicLayout>
  );
});

Step5AcademicPage.displayName = 'Step5AcademicPage';
