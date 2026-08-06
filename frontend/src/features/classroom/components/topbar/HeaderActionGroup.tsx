'use client';

import { memo } from 'react';
import { Users } from 'lucide-react';
import { useHeaderActionGroup } from '../../hooks/useHeaderActionGroup';
import { MobileMenuButton } from './MobileMenuButton';
import { LeaveClassButton } from './LeaveClassButton';
import type { HeaderActionGroupProps } from '../../types/topbar.types';

export const HeaderActionGroup = memo(function HeaderActionGroup({
  onLeaveClass,
  onOpenParticipants,
}: HeaderActionGroupProps) {
  const { handleLeaveClass, handleOpenParticipants } = useHeaderActionGroup(
    onLeaveClass,
    onOpenParticipants
  );

  return (
    <div className="flex items-center gap-3 md:gap-4 shrink-0">
      {/* Mobile Sidebar Toggle Button */}
      <MobileMenuButton />

      {/* Participants Quick Button */}
      <button
        type="button"
        onClick={handleOpenParticipants}
        aria-label="View Participants"
        className="p-2 rounded-full hover:bg-white/10 transition-colors text-[#c4c5d9] hover:text-white flex items-center justify-center cursor-pointer"
      >
        <Users className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Leave Class Action Button Sub-component */}
      <LeaveClassButton onLeaveClass={handleLeaveClass} />
    </div>
  );
});

HeaderActionGroup.displayName = 'HeaderActionGroup';
