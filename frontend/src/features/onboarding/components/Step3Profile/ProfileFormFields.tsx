'use client';

import { memo } from 'react';
import type { ProfileFormFieldsProps } from '../../types';
import { FullNameInput } from './FullNameInput';
import { DobInput } from './DobInput';
import { CountrySelect } from './CountrySelect';
import { TimezoneSelect } from './TimezoneSelect';
import { LanguageSelect } from './LanguageSelect';
import { ProfileFormActions } from './ProfileFormActions';

function ProfileFormFieldsComponent({
  profile,
  onChange,
  onSubmit,
  onBack,
}: ProfileFormFieldsProps) {
  return (
    <div className="space-y-6 font-['Hanken_Grotesk',sans-serif]">
      {/* 1. Full Name */}
      <FullNameInput
        value={profile.fullName}
        onChange={(val) => onChange('fullName', val)}
      />

      {/* 2. Date of Birth & Country Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DobInput
          value={profile.dob}
          onChange={(val) => onChange('dob', val)}
        />
        <CountrySelect
          value={profile.country}
          onChange={(val) => onChange('country', val)}
        />
      </div>

      {/* 3. Timezone & Preferred Language Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TimezoneSelect
          value={profile.timezone}
          onChange={(val) => onChange('timezone', val)}
        />
        <LanguageSelect
          value={profile.language || 'English'}
          onChange={(val) => onChange('language', val)}
        />
      </div>

      {/* Form Action Buttons */}
      <ProfileFormActions
        onBack={onBack}
        onSubmit={onSubmit}
        isSubmitDisabled={!profile.fullName.trim()}
      />
    </div>
  );
}

export const ProfileFormFields = memo(ProfileFormFieldsComponent);
ProfileFormFields.displayName = 'ProfileFormFields';
