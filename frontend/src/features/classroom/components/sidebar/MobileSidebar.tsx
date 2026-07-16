'use client';
import { useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';
import { VoiceSelector } from './VoiceSelector';
import { SuggestionsList } from './SuggestionsList';
import { KeyPointsPanel } from './KeyPointsPanel';

interface MobileSidebarProps {
  onAsk: (q: string) => void;
  loading: boolean;
  isPlaying: boolean;
}

export function MobileSidebar({ onAsk, loading, isPlaying }: MobileSidebarProps) {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileSidebarOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setMobileSidebarOpen]);

  return (
    <>
      {/* Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out lg:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-lg">
              🎓
            </div>
            <div>
              <p className="font-bold text-white text-sm">Prof. Gemini</p>
              <p className="text-xs text-slate-400">AI Physics Teacher</p>
            </div>
          </div>
          <button
            id="mobile-sidebar-close"
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 p-5">
          <VoiceSelector />
          <KeyPointsPanel isPlaying={isPlaying} />
          <SuggestionsList
            onAsk={(q) => {
              onAsk(q);
              setMobileSidebarOpen(false);
            }}
            loading={loading}
            isPlaying={isPlaying}
          />
        </div>
      </aside>
    </>
  );
}
