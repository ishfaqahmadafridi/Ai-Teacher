'use client';

import { useState, memo } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import {
  highSchoolYears,
  universityYears,
  postgraduateYears,
  professionalYears,
  selfLearnerYears,
} from '../../types';
import type {
  AcademicYearMode,
  UniversityDegreeTrack,
  AcademicSemester,
  YearOption,
} from '../../types';
import { Step5AcademicLayout } from './Step5AcademicLayout';
import { AcademicHeader } from './AcademicHeader';
import { AcademicLevelToggle } from './AcademicLevelToggle';
import { UniversityDegreeSelector } from './UniversityDegreeSelector';
import { SemesterYearSelector } from './SemesterYearSelector';
import { AcademicYearGrid } from './AcademicYearGrid';
import { GrowthTrajectoryCard } from './GrowthTrajectoryCard';

export const Step5AcademicPage = memo(function Step5AcademicPage() {
  const { academicYear, selectAcademicYear } = useOnboarding();
  const [levelMode, setLevelMode] = useState<AcademicYearMode>('university');
  const [selectedTrack, setSelectedTrack] = useState<UniversityDegreeTrack>('undergraduate');
  const [selectedSemester, setSelectedSemester] = useState<AcademicSemester>('sem_1');

  const getYearsForUniversity = (): YearOption[] => {
    switch (selectedTrack) {
      case 'masters':
      case 'doctorate':
      case 'postdoc':
        return postgraduateYears;
      case 'undergraduate':
      default:
        return universityYears;
    }
  };

  const currentYears: YearOption[] =
    levelMode === 'university'
      ? getYearsForUniversity()
      : levelMode === 'high_school'
      ? highSchoolYears
      : levelMode === 'professional'
      ? professionalYears
      : selfLearnerYears;

  return (
    <Step5AcademicLayout>
      <AcademicHeader />

      {/* Main Level Toggle: High School | University | Professional | Lifelong */}
      <AcademicLevelToggle levelMode={levelMode} onToggleLevel={setLevelMode} />

      {/* When University is selected, show University Degree Track Cards */}
      {levelMode === 'university' && (
        <UniversityDegreeSelector
          selectedTrack={selectedTrack}
          onSelectTrack={setSelectedTrack}
        />
      )}

      {/* Year & Semester Selector */}
      {levelMode === 'university' ? (
        <SemesterYearSelector
          selectedYear={academicYear}
          onSelectYear={selectAcademicYear}
          selectedSemester={selectedSemester}
          onSelectSemester={setSelectedSemester}
        />
      ) : (
        <AcademicYearGrid
          years={currentYears}
          selectedYear={academicYear}
          onSelectYear={selectAcademicYear}
        />
      )}

      <GrowthTrajectoryCard />
    </Step5AcademicLayout>
  );
});

Step5AcademicPage.displayName = 'Step5AcademicPage';
