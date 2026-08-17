'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ProfileFormActionsProps } from '../../types';

function ProfileFormActionsComponent({
  onBack,
  onSubmit,
  isSubmitDisabled = false,
}: ProfileFormActionsProps) {
  return (
    <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="h-12 px-5 rounded-xl border border-white/15 text-[#c6c6cc] hover:text-white hover:bg-white/10 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>

      <Button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className="h-12 px-8 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#004AC6] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#2563eb]/40 hover:from-[#1D4ED8] hover:to-[#003BB0] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <span>Continue</span>
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

export const ProfileFormActions = memo(ProfileFormActionsComponent);
ProfileFormActions.displayName = 'ProfileFormActions';
