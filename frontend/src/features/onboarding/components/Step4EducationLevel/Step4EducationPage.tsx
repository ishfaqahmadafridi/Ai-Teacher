'use client';

import { useOnboarding } from '../../hooks/useOnboarding';
import { Step4EducationLayout } from './Step4EducationLayout';
import { EducationGrid } from './EducationGrid';

export function Step4EducationPage() {
  const { educationLevel, selectEducationLevel } = useOnboarding();

  return (
    <Step4EducationLayout>
      <EducationGrid
        selectedLevel={educationLevel}
        onSelectLevel={selectEducationLevel}
      />
    </Step4EducationLayout>
  );
}
