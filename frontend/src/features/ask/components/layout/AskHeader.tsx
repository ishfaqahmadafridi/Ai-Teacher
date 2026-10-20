'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui';
import type { AskHeaderProps } from '../../types/ask.types';

export const AskHeader = memo(function AskHeader({
  drawerOpen,
  onOpenDrawer,
  className = '',
}: AskHeaderProps) {
  return (
    <header className={`absolute top-0 left-0 right-0 z-20 h-16 flex items-center justify-between px-6 bg-dashboard-panel/95 backdrop-blur-md border-b border-dashboard-border ${className}`}>
      {/* Brand & Drawer Trigger */}
      <div className="flex items-center gap-4">
        {!drawerOpen && (
          <Button
            type="button"
            onClick={onOpenDrawer}
            className="text-dashboard-muted hover:text-dashboard-text p-2 rounded-xl hover:bg-dashboard-subtle transition-all duration-200 border-none bg-transparent cursor-pointer"
            title="Open Sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </Button>
        )}
        <Link href="/home" className="flex items-center gap-3 no-underline select-none group">
          <div className="relative w-10 h-10 shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/neurolearn-brain-logo.png"
              alt="NEUROLEARN Logo"
              fill
              sizes="40px"
              className="object-contain rounded-lg"
              priority
            />
          </div>
          <span className="font-semibold tracking-tight text-dashboard-text group-hover:text-dashboard-primary transition-colors text-lg font-['Outfit',sans-serif]">
            Neurolearn
          </span>
        </Link>
      </div>

      {/* Right header actions */}
      <div className="flex items-center gap-4">
      </div>
    </header>
  );
});

AskHeader.displayName = 'AskHeader';
