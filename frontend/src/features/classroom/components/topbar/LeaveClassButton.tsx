'use client';

import { memo } from 'react';
import { LogOut } from 'lucide-react';
import type { TopBarLeaveClassButtonProps } from '../../types/topbar.types';

export const LeaveClassButton = memo(function LeaveClassButton({
  onLeaveClass,
  className = '',
}: TopBarLeaveClassButtonProps) {
  return (
    <button
      type="button"
      onClick={onLeaveClass}
      className={`bg-[#93000a]/20 hover:bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/20 px-4 md:px-6 py-2 rounded-full font-['Hanken_Grotesk',sans-serif] text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 ${className}`}
    >
      <LogOut className="w-4 h-4" aria-hidden="true" />
      <span className="hidden sm:inline">Leave Class</span>
    </button>
  );
});

LeaveClassButton.displayName = 'LeaveClassButton';
