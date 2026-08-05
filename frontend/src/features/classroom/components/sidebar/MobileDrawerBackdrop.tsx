'use client';

import { memo } from 'react';

export interface MobileDrawerBackdropProps {
  onClose: () => void;
  className?: string;
}

export const MobileDrawerBackdrop = memo(function MobileDrawerBackdrop({
  onClose,
  className = '',
}: MobileDrawerBackdropProps) {
  return (
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm ${className}`}
      onClick={onClose}
      aria-hidden="true"
    />
  );
});

MobileDrawerBackdrop.displayName = 'MobileDrawerBackdrop';
