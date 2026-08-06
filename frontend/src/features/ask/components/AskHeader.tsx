'use client';

import Link from 'next/link';
import { Brain } from 'lucide-react';
import type { AskHeaderProps } from '../types';
import { Button } from './ui';

export function AskHeader({ drawerOpen, onOpenDrawer }: AskHeaderProps) {
  return (
    <header 
      className="absolute top-0 left-0 right-0 z-30 bg-[#0a0f18]/60 backdrop-blur-[40px] border-b border-white/10 h-16 flex justify-between items-center px-6"
    >
      <div className="flex items-center gap-4">
        {!drawerOpen && (
          <Button 
            onClick={onOpenDrawer}
            className="flex items-center justify-center p-2 rounded-lg text-slate-300 hover:bg-white/5 transition-all duration-200 cursor-pointer border-none outline-none bg-transparent"
          >
            {/* Hamburger Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </Button>
        )}
        <Link href="/home" className="flex items-center gap-3 no-underline select-none group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#1d4ed8] via-[#2563eb] to-[#38bdf8] text-white flex items-center justify-center shadow-lg shadow-[#2563eb]/30 shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Brain className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-extrabold tracking-[0.14em] uppercase text-white group-hover:text-[#38bdf8] transition-colors text-lg font-['Hanken_Grotesk',sans-serif]">
            NEUROLEARN
          </span>
        </Link>
      </div>

      {/* Right header actions */}
      <div className="flex items-center gap-4">
      </div>
    </header>
  );
}
