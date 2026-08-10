'use client';

import { memo } from 'react';
import { ProfileIdentityFields } from './ProfileIdentityFields';
import { ProfileContactFields } from './ProfileContactFields';
import { ProfileAcademicFields } from './ProfileAcademicFields';
import type { ProfilePersonalTabProps } from '../../types/profile.types';

export const ProfilePersonalTab = memo(function ProfilePersonalTab({
  formData,
  onChange,
  className = '',
}: ProfilePersonalTabProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Full Name & Student ID Row */}
      <ProfileIdentityFields
        name={formData.name}
        studentId={formData.studentId}
        onChange={onChange}
      />

      {/* Email & Phone Number Row */}
      <ProfileContactFields
        email={formData.email}
        phone={formData.phone}
        onChange={onChange}
      />

      {/* Program / Grade Level & Bio */}
      <ProfileAcademicFields
        gradeLevel={formData.gradeLevel}
        bio={formData.bio}
        onChange={onChange}
      />
    </div>
  );
});

ProfilePersonalTab.displayName = 'ProfilePersonalTab';
