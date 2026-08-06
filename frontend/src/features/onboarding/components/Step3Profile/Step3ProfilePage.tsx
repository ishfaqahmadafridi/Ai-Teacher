'use client';

import { useRouter } from 'next/navigation';
import { useOnboarding } from '../../hooks/useOnboarding';
import { Step3ProfileLayout } from './Step3ProfileLayout';
import { ProfileFormContainer } from './ProfileFormContainer';
import { AIMentorBannerCard } from './AIMentorBannerCard';

export function Step3ProfilePage() {
  const router = useRouter();
  const { profile, updateProfile, submitProfile } = useOnboarding();

  return (
    <Step3ProfileLayout>
      <ProfileFormContainer
        profile={profile}
        updateProfile={updateProfile}
        onSubmit={submitProfile}
        onBack={() => router.back()}
      />
      <AIMentorBannerCard fullName={profile.fullName} />
    </Step3ProfileLayout>
  );
}
