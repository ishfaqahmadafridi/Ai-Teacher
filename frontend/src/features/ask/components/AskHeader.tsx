import Link from 'next/link';
import Image from 'next/image';
import type { AskHeaderProps } from '../types';
import { Button } from './ui';

export function AskHeader({ drawerOpen, onOpenDrawer }: AskHeaderProps) {
  return (
    <header 
      className="absolute top-0 left-0 right-0 z-30 bg-[#0a0f18]/40 backdrop-blur-[50px] border-b border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.08)] h-16 flex justify-between items-center px-6"
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
        <div className="flex items-center gap-2">
          <Link href="/home" className="flex items-center gap-2 no-underline">
            <div className="relative" style={{ width: 60, height: 60, flexShrink: 0, marginTop: '-12px', marginBottom: '-12px' }}>
              <Image
                src="/neurolearn-logo.png"
                alt="NeuroLearn Logo"
                fill
                sizes="60px"
                className="object-contain"
                style={{ filter: 'drop-shadow(0 0 10px rgba(79,195,247,0.75))' }}
                priority
              />
            </div>
          </Link>
        </div>
      </div>

      {/* Right header actions */}
      <div className="flex items-center gap-4">
      </div>
    </header>
  );
}
