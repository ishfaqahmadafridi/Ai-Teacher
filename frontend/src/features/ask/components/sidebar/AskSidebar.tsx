'use client';

import { memo } from 'react';
import { Button } from '../ui';
import { SidebarUserProfile } from './SidebarUserProfile';
import { SidebarNavList } from './SidebarNavList';
import type { AskSidebarProps } from '../../types/ask.types';

export const AskSidebar = memo(function AskSidebar({
  drawerOpen,
  onClose,
  className = '',
}: AskSidebarProps) {
  return (
    <>
      {/* Overlay Backdrop - mobile only */}
      <div 
        onClick={onClose}
        className={`lg:hidden fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar Content */}
      <aside 
        className={`fixed lg:relative inset-y-0 left-0 z-40 flex flex-col p-6 h-full w-80 bg-[#121824] border-r border-white/10 shadow-2xl transition-all duration-300 ease-in-out shrink-0 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-80'
        } ${className}`}
      >
        <SidebarUserProfile onClose={onClose} />

        <SidebarNavList />

        <div className="mt-auto pt-4 border-t border-white/5">
          <Button
            type="button"
            className="w-full text-left flex items-center gap-3 p-3.5 rounded-xl text-slate-400 hover:bg-white/5 transition-all duration-200 text-sm font-medium border-none bg-transparent cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Settings</span>
          </Button>
        </div>
      </aside>
    </>
  );
});

AskSidebar.displayName = 'AskSidebar';
