'use client';

import { memo } from 'react';
import Link from 'next/link';
import { useLeaveClass } from '../../../hooks/useLeaveClass';
import { LogOut } from 'lucide-react';
import type { LeaveClassButtonProps } from '../../../types/input.types';

export const LeaveClassButton = memo(function LeaveClassButton({
  className = '',
}: LeaveClassButtonProps) {
  const { leave } = useLeaveClass();
  return (
    <Link
      href="/dashboard"
      onClick={leave}
      className={`min-h-11 px-4 py-2 rounded-xl border border-dashboard-danger/25 bg-dashboard-danger/5 hover:bg-dashboard-danger/10 text-dashboard-danger text-xs font-semibold flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashboard-primary transition-all cursor-pointer shrink-0 active:scale-95  ${className}`}
      title="Leave class and return to Dashboard"
    >
      <LogOut className="w-4 h-4 text-dashboard-danger" />
      <span>Leave Class</span>
    </Link>
  );
});

LeaveClassButton.displayName = 'LeaveClassButton';
