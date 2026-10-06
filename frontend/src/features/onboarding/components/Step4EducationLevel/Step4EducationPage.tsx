'use client';

import { memo } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { Step4EducationLayout } from './Step4EducationLayout';
import { EducationHeader } from './EducationHeader';
import { EducationGrid } from './EducationGrid';

export const Step4EducationPage = memo(function Step4EducationPage() {
  const { educationLevel, selectEducationLevel, error } = useOnboarding();

  return (
    <Step4EducationLayout>
      {error && <p role="alert">{error}</p>}
      <EducationHeader />
      <EducationGrid
        selectedLevel={educationLevel}
        onSelectLevel={selectEducationLevel}
      />
    </Step4EducationLayout>
  );
});

Step4EducationPage.displayName = 'Step4EducationPage';

