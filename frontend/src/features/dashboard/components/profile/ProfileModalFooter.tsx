'use client';

import { memo } from 'react';
import { CheckCircle2, Save } from 'lucide-react';
import type { ProfileModalFooterProps } from '../../types/profile.types';

export const ProfileModalFooter = memo(function ProfileModalFooter({
  isSaved,
  onClose,
  className = '',
}: ProfileModalFooterProps) {
  return (
    <div className={`pt-4 border-t border-[#1E293B] flex items-center justify-end gap-3 ${className}`}>
      <button
        type="button"
        onClick={onClose}
        className="px-5 py-2.5 rounded-xl border border-[#334155] text-[#94A3B8] hover:text-white hover:bg-[#1E293B] text-sm font-semibold transition-all cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white text-sm font-semibold shadow-lg shadow-[#2563eb]/25 transition-all flex items-center gap-2 cursor-pointer"
      >
        {isSaved ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Saved!</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </>
        )}
      </button>
    </div>
  );
});

ProfileModalFooter.displayName = 'ProfileModalFooter';
