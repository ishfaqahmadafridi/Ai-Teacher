'use client';

import { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '../../hooks/useOnboarding';
import { Step3ProfileLayout } from './Step3ProfileLayout';
import { ProfileFormContainer } from './ProfileFormContainer';
import { ProfileFormHeader } from './ProfileFormHeader';
import { ProfileFormFields } from './ProfileFormFields';
import { AIMentorBannerCard } from './AIMentorBannerCard';
import type { StudentProfileData } from '../../types';

export const Step3ProfilePage = memo(function Step3ProfilePage() {
  const router = useRouter();
  const { profile, updateProfile, submitProfile } = useOnboarding();

  const handleFieldChange = useCallback(
    (field: keyof StudentProfileData, value: string) => {
      updateProfile({ [field]: value });
    },
    [updateProfile]
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Step3ProfileLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <ProfileFormContainer>
            <ProfileFormHeader />
            <ProfileFormFields
              profile={profile}
              onChange={handleFieldChange}
              onSubmit={submitProfile}
              onBack={handleBack}
            />
          </ProfileFormContainer>
        </div>
        <div className="lg:col-span-1">
          <AIMentorBannerCard />
        </div>
      </div>
    </Step3ProfileLayout>
  );
});

Step3ProfilePage.displayName = 'Step3ProfilePage';
