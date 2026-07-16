'use client';
import { VoiceSelector } from './VoiceSelector';
import { SuggestionsList } from './SuggestionsList';
import { KeyPointsPanel } from './KeyPointsPanel';

interface SidebarProps {
  onAsk: (q: string) => void;
  loading: boolean;
  isPlaying: boolean;
}

export function Sidebar({ onAsk, loading, isPlaying }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-slate-900/80 backdrop-blur border-r border-slate-800 overflow-y-auto">
      {/* Logo / Branding */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-lg">
            🎓
          </div>
          <div>
            <p className="font-bold text-white text-sm">Prof. Gemini</p>
            <p className="text-xs text-slate-400">AI Physics Teacher</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-5">
        <VoiceSelector />
        <KeyPointsPanel isPlaying={isPlaying} />
        <SuggestionsList onAsk={onAsk} loading={loading} isPlaying={isPlaying} />
      </div>
    </aside>
  );
}
