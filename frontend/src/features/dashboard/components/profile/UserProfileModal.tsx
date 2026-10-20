'use client';

import { memo } from 'react';
import { DashboardDialog } from '../modals/DashboardDialog';
import { ProfileModalHeader } from './ProfileModalHeader';
import { ProfileFileInputs } from './ProfileFileInputs';
import { ProfileModalForm } from './ProfileModalForm';
import { useUserProfileModal } from '../../hooks/useUserProfileModal';
import type { UserProfileModalProps } from '../../types/profile.types';

export const UserProfileModal = memo(function UserProfileModal(props: UserProfileModalProps) {
  const model = useUserProfileModal(props);
  const { avatarFileInputRef, coverFileInputRef, handleAvatarFileUpload, handleCoverFileUpload } = model;

  if (!props.isOpen) return null;

  return (
    <DashboardDialog title="Your profile" onClose={props.onClose} className="max-w-[42rem]">
        <ProfileFileInputs avatarFileInputRef={avatarFileInputRef} coverFileInputRef={coverFileInputRef} onAvatarFileUpload={handleAvatarFileUpload} onCoverFileUpload={handleCoverFileUpload} />
        <ProfileModalHeader model={model} onClose={props.onClose} />
        <ProfileModalForm model={model} onClose={props.onClose} />
    </DashboardDialog>
  );
});

UserProfileModal.displayName = 'UserProfileModal';
