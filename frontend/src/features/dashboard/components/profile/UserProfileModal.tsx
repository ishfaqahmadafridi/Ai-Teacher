'use client';

import { memo } from 'react';
import { ProfileModalHeader } from './ProfileModalHeader';
import { ProfileModalForm } from './ProfileModalForm';
import { useUserProfileModal } from '../../hooks/useUserProfileModal';
import { ProfileFileInputs } from './ProfileFileInputs';
import { ProfileModalBackdrop } from './ProfileModalBackdrop';
import type { UserProfileModalProps } from '../../types/profile.types';

export const UserProfileModal = memo(function UserProfileModal(props: UserProfileModalProps) {
  const model = useUserProfileModal(props);
  const { avatarFileInputRef, coverFileInputRef, handleAvatarFileUpload, handleCoverFileUpload, handleCloseAllMenus } = model;

  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Hidden File Inputs Subcomponent */}
      <ProfileFileInputs
        avatarFileInputRef={avatarFileInputRef}
        coverFileInputRef={coverFileInputRef}
        onAvatarFileUpload={handleAvatarFileUpload}
        onCoverFileUpload={handleCoverFileUpload}
      />

      {/* Backdrop Subcomponent */}
      <ProfileModalBackdrop onClick={handleCloseAllMenus} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-[#1E293B] rounded-3xl shadow-2xl z-10 font-['Hanken_Grotesk',sans-serif] my-8">
        <ProfileModalHeader model={model} onClose={props.onClose} />
        <ProfileModalForm model={model} onClose={props.onClose} />
      </div>
    </div>
  );
});

UserProfileModal.displayName = 'UserProfileModal';
