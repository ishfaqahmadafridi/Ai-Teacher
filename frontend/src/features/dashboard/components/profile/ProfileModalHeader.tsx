'use client';

import { ProfileCoverHeader } from './ProfileCoverHeader';
import { ProfileAvatarHeader } from './ProfileAvatarHeader';
import { ProfileMetaInfo } from './ProfileMetaInfo';
import type { ProfileModalSectionProps } from '../../types/profile.types';

export function ProfileModalHeader({ model, onClose }: ProfileModalSectionProps) {
  const { formData, showAvatarMenu, showAvatarPresets, showCoverMenu, showCoverPresets, avatarFileInputRef, coverFileInputRef, handleSelectPresetAvatar, handleSelectPresetCover, handleToggleCoverMenu, handleToggleCoverPresets, handleCloseCoverMenu, handleToggleAvatarMenu, handleToggleAvatarPresets, handleCloseAvatarMenu } = model;
  return (
    <>
        {/* Top Header Cover Banner Subcomponent */}
        <ProfileCoverHeader
          coverUrl={formData.coverUrl}
          showCoverMenu={showCoverMenu}
          showCoverPresets={showCoverPresets}
          onToggleCoverMenu={handleToggleCoverMenu}
          onToggleCoverPresets={handleToggleCoverPresets}
          onCloseCoverMenu={handleCloseCoverMenu}
          onSelectPresetCover={handleSelectPresetCover}
          onUploadCoverClick={() => coverFileInputRef.current?.click()}
          onCloseModal={onClose}
        />

        {/* Profile Avatar & Header Meta Section */}
        <div className="px-6 sm:px-8 pb-5 relative bg-[#0F172A]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar Header Subcomponent */}
            <ProfileAvatarHeader
              avatarUrl={formData.avatarUrl}
              studentName={formData.name}
              showAvatarMenu={showAvatarMenu}
              showAvatarPresets={showAvatarPresets}
              onToggleAvatarMenu={handleToggleAvatarMenu}
              onToggleAvatarPresets={handleToggleAvatarPresets}
              onCloseAvatarMenu={handleCloseAvatarMenu}
              onSelectPresetAvatar={handleSelectPresetAvatar}
              onUploadAvatarClick={() => avatarFileInputRef.current?.click()}
            />

            {/* Student Quick Meta Subcomponent */}
            <ProfileMetaInfo
              name={formData.name}
              email={formData.email}
              phone={formData.phone}
              studentId={formData.studentId}
              gradeLevel={formData.gradeLevel}
              isVerified={formData.isVerified}
            />
          </div>
        </div>


    </>
  );
}
