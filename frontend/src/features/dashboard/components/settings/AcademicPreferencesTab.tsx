'use client';

import { memo } from 'react';
import {
  AcademicLevelCard,
  PrimaryDisciplineCard,
  SpecializationCard,
} from './academic';
import type { SettingsTabProps } from '../../types/settings.types';

export const AcademicPreferencesTab = memo(function AcademicPreferencesTab({
  settings,
  onChange,
  className = '',
}: SettingsTabProps) {
  return (
    <div className={`space-y-6 font-['Hanken_Grotesk',sans-serif] ${className}`}>
      {/* Academic Level Card */}
      <AcademicLevelCard
        academicLevel={settings.academicLevel}
        onChangeLevel={(level) => onChange('academicLevel', level)}
      />

      {/* Primary Discipline & Major Card */}
      <PrimaryDisciplineCard
        primaryField={settings.primaryField}
        onChangeField={(field) => onChange('primaryField', field)}
      />

      {/* Specialization & Research Focus Card */}
      <SpecializationCard
        specialization={settings.specialization}
        onChangeSpecialization={(specialization) => onChange('specialization', specialization)}
      />
    </div>
  );
});

AcademicPreferencesTab.displayName = 'AcademicPreferencesTab';
