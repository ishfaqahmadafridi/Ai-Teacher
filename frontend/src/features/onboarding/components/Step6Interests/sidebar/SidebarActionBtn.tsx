'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import type { SidebarActionBtnProps } from '../../../types';

export const SidebarActionBtn = memo(function SidebarActionBtn({
  isDisabled,
  onSubmit,
}: SidebarActionBtnProps) {
  return (
    <Button
      type="button"
      onClick={onSubmit}
      disabled={isDisabled}
      className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#004AC6] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#2563eb]/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative z-10"
    >
      <CheckCircle2 className="w-4 h-4" />
      <span>Launch My Roadmap →</span>
    </Button>
  );
});

SidebarActionBtn.displayName = 'SidebarActionBtn';
