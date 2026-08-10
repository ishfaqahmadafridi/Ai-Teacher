'use client';

import { memo } from 'react';
import type { ProfileModalBackdropProps } from '../../types/profile.types';

export const ProfileModalBackdrop = memo(function ProfileModalBackdrop({
  onClick,
  className = '',
}: ProfileModalBackdropProps) {
  return (
    <div
      className={`fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity ${className}`}
      onClick={onClick}
      aria-hidden="true"
    />
  );
});

ProfileModalBackdrop.displayName = 'ProfileModalBackdrop';
