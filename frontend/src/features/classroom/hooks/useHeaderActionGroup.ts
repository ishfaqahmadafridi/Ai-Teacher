'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useHeaderActionGroup(
  onLeaveClass?: () => void,
  onOpenParticipants?: () => void
) {
  const router = useRouter();

  const handleLeaveClass = useCallback(() => {
    if (onLeaveClass) {
      onLeaveClass();
    } else {
      router.push('/dashboard');
    }
  }, [onLeaveClass, router]);

  const handleOpenParticipants = useCallback(() => {
    if (onOpenParticipants) {
      onOpenParticipants();
    }
  }, [onOpenParticipants]);

  return {
    handleLeaveClass,
    handleOpenParticipants,
  };
}
