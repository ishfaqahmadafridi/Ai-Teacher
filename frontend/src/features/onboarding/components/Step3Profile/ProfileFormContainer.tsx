'use client';

import { Card, CardContent } from "@/components/ui/card";
import { StudentProfileData } from '../../types';
import { ProfileFormHeader } from './ProfileFormHeader';
import { ProfilePhotoUpload } from './ProfilePhotoUpload';
import { ProfileFormFields } from './ProfileFormFields';
import { ProfileFormActions } from './ProfileFormActions';

interface ProfileFormContainerProps {
  profile: StudentProfileData;
  updateProfile: (data: Partial<StudentProfileData>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function ProfileFormContainer({
  profile,
  updateProfile,
  onSubmit,
  onBack,
}: ProfileFormContainerProps) {
  return (
    <div className="lg:col-span-7 order-2 lg:order-1">
      <Card className="bg-white/5 border-white/10 backdrop-blur-[40px] p-8 md:p-12 rounded-[32px] shadow-2xl">
        <CardContent className="p-0">
          <ProfileFormHeader />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="space-y-6"
          >
            <ProfilePhotoUpload />
            <ProfileFormFields profile={profile} updateProfile={updateProfile} />
            <ProfileFormActions onBack={onBack} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
