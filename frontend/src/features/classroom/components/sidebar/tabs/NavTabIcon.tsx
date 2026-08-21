'use client';

import { memo } from 'react';
import { FileText, BookOpen, HelpCircle, Megaphone, Users } from 'lucide-react';
import type { NavTabIconProps } from '../../../types/sidebar.types';

export const NavTabIcon = memo(function NavTabIcon({
  iconName,
  className = 'w-5 h-5',
}: NavTabIconProps) {
  switch (iconName) {
    case 'students':
      return <Users className={className} aria-hidden="true" />;
    case 'notes':
      return <BookOpen className={className} aria-hidden="true" />;
    case 'assignments':
      return <FileText className={className} aria-hidden="true" />;
    case 'quiz':
      return <HelpCircle className={className} aria-hidden="true" />;
    case 'announcements':
      return <Megaphone className={className} aria-hidden="true" />;
    default:
      return null;
  }
});

NavTabIcon.displayName = 'NavTabIcon';
