'use client';

import { memo } from 'react';
import { Card } from '@/components/ui/card';
import type { ProfileFormContainerProps } from '../../types';

function ProfileFormContainerComponent({ children }: ProfileFormContainerProps) {
  return (
    <Card className="bg-[#070D1A]/90 border border-[#1E293B] backdrop-blur-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden font-['Hanken_Grotesk',sans-serif]">
      {children}
    </Card>
  );
}

export const ProfileFormContainer = memo(ProfileFormContainerComponent);
ProfileFormContainer.displayName = 'ProfileFormContainer';
