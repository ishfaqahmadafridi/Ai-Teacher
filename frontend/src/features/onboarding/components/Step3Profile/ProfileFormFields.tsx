'use client';

import { StudentProfileData } from '../../types';
import { FullNameInput } from './FullNameInput';
import { DobInput } from './DobInput';
import { CountrySelect } from './CountrySelect';
import { TimezoneSelect } from './TimezoneSelect';
import { LanguageSelect } from './LanguageSelect';

interface ProfileFormFieldsProps {
  profile: StudentProfileData;
  updateProfile: (data: Partial<StudentProfileData>) => void;
}

export function ProfileFormFields({ profile, updateProfile }: ProfileFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FullNameInput
        value={profile.fullName}
        onChange={(fullName) => updateProfile({ fullName })}
      />

      <DobInput
        value={profile.dob}
        onChange={(dob) => updateProfile({ dob })}
      />

      <CountrySelect
        value={profile.country}
        onChange={(country) => updateProfile({ country })}
      />

      <TimezoneSelect
        value={profile.timezone}
        onChange={(timezone) => updateProfile({ timezone })}
      />

      <LanguageSelect
        value={profile.language}
        onChange={(language) => updateProfile({ language })}
      />
    </div>
  );
}

