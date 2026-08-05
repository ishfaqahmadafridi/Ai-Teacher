'use client';

import { memo } from 'react';
import { useMobileMenuButton } from '../../hooks/useMobileMenuButton';

export const MobileMenuButton = memo(function MobileMenuButton() {
  const { handleToggle } = useMobileMenuButton();

  return (
    <button
      id="mobile-menu-btn"
      type="button"
      onClick={handleToggle}
      aria-label="Open menu"
      className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all mr-1 cursor-pointer"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
      </svg>
    </button>
  );
});

MobileMenuButton.displayName = 'MobileMenuButton';
