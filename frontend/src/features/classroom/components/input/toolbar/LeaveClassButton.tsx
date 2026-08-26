'use client';

import { memo } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import type { LeaveClassButtonProps } from '../../../types/input.types';

export const LeaveClassButton = memo(function LeaveClassButton({
  className = '',
}: LeaveClassButtonProps) {
  return (
    <Link
      href="/dashboard"
      className={`px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 active:scale-95 shadow-md shadow-red-600/25 ${className}`}
      title="Leave Physics Class & return to Dashboard"
    >
      <LogOut className="w-4 h-4 text-white" />
      <span>Leave Class</span>
    </Link>
  );
});

LeaveClassButton.displayName = 'LeaveClassButton';
