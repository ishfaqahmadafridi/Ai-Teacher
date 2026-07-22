import type { AskSidebarProps } from '../types';
import { Button } from './ui';

export function AskSidebar({ drawerOpen, onClose }: AskSidebarProps) {
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
        }`}
      >
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
              U
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Alex Rivers</h3>
              <p className="text-[11px] text-slate-400">Pro Learner • 850 XP</p>
            </div>
          </div>
          <Button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 bg-transparent border-none cursor-pointer outline-none"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </Button>
        </div>

        <nav className="flex-1 space-y-1.5">
          <Button className="w-full text-left flex items-center gap-3 p-3.5 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20 text-sm font-medium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Active Chat</span>
          </Button>
          <Button className="w-full text-left flex items-center gap-3 p-3.5 rounded-xl text-slate-400 hover:bg-white/5 transition-all duration-200 text-sm font-medium border-none bg-transparent cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Chat History</span>
          </Button>
          <Button className="w-full text-left flex items-center gap-3 p-3.5 rounded-xl text-slate-400 hover:bg-white/5 transition-all duration-200 text-sm font-medium border-none bg-transparent cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              <path d="M6 6h10M6 10h10"/>
            </svg>
            <span>Learning Paths</span>
          </Button>
        </nav>

        <div className="mt-auto pt-4 border-t border-white/5">
          <Button className="w-full text-left flex items-center gap-3 p-3.5 rounded-xl text-slate-400 hover:bg-white/5 transition-all duration-200 text-sm font-medium border-none bg-transparent cursor-pointer">
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
}
