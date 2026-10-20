import { memo } from 'react';
import { LayoutDashboard, GraduationCap } from 'lucide-react';
import type { FutureInterfaceIconProps } from '../../../types';

export const FutureInterfaceIcon = memo(function FutureInterfaceIcon({ name }: FutureInterfaceIconProps) {
  switch (name) {
    case 'sparkles': return <LayoutDashboard aria-hidden="true" size={20} strokeWidth={1.75} />;
    case 'graduation-cap': return <GraduationCap aria-hidden="true" size={20} strokeWidth={1.75} />;
    default: return null;
  }
});

FutureInterfaceIcon.displayName = 'FutureInterfaceIcon';
