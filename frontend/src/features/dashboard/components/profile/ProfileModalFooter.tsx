'use client';

import { memo } from 'react';
import { CheckCircle2, Save, LogOut } from 'lucide-react';
import type { ProfileModalFooterProps } from '../../types/profile.types';

export const ProfileModalFooter = memo(function ProfileModalFooter({
  isSaved,
  isSaving = false,
  onClose,
  onLogout,
  className = '',
}: ProfileModalFooterProps) {
  return (
    <div className={`pt-4 border-t border-dashboard-border flex items-center justify-between gap-3 ${className}`}>
      {/* Left: Logout Button */}
      {onLogout ? (
        <button
          type="button"
          onClick={onLogout}
          className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-none"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          <span>Log Out</span>
        </button>
      ) : (
        <div />
      )}

      {/* Right: Cancel & Save Changes */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl border border-dashboard-border text-dashboard-muted hover:text-dashboard-text hover:bg-dashboard-subtle text-sm font-semibold transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-dashboard-primary hover:bg-dashboard-primary-hover text-white text-sm font-semibold shadow-none transition-all flex items-center gap-2 cursor-pointer"
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
    </div>
  );
});

ProfileModalFooter.displayName = 'ProfileModalFooter';
