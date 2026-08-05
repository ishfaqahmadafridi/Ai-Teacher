'use client';

import { memo } from 'react';
import { useHeaderActionGroup } from '../../hooks/useHeaderActionGroup';
import { MobileMenuButton } from './MobileMenuButton';
import { LeaveClassButton } from './LeaveClassButton';
import type { HeaderActionGroupProps } from '../../types/topbar.types';

export const HeaderActionGroup = memo(function HeaderActionGroup({
  onLeaveClass,
  onOpenParticipants,
}: HeaderActionGroupProps) {
  const { handleLeaveClass } = useHeaderActionGroup(onLeaveClass, onOpenParticipants);

  return (
    <div className="flex items-center gap-3 shrink-0">
      {/* Mobile Sidebar Toggle Button Sub-component */}
      <MobileMenuButton />

      {/* Leave Class Action Button Sub-component */}
      <LeaveClassButton onLeaveClass={handleLeaveClass} />
    </div>
  );
});

HeaderActionGroup.displayName = 'HeaderActionGroup';
