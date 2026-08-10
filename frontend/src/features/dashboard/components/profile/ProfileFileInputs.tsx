'use client';

import { memo } from 'react';
import type { ProfileFileInputsProps } from '../../types/profile.types';

export const ProfileFileInputs = memo(function ProfileFileInputs({
  avatarFileInputRef,
  coverFileInputRef,
  onAvatarFileUpload,
  onCoverFileUpload,
}: ProfileFileInputsProps) {
  return (
    <>
      <input
        type="file"
        ref={avatarFileInputRef}
        onChange={onAvatarFileUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={coverFileInputRef}
        onChange={onCoverFileUpload}
        accept="image/*"
        className="hidden"
      />
    </>
  );
});

ProfileFileInputs.displayName = 'ProfileFileInputs';
