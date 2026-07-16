'use client';
import Link from 'next/link';
import { useAppSelector } from '@/hooks/useAppStore';
import { MobileMenuButton } from './MobileMenuButton';

export function TopBar() {
  const topic = useAppSelector((s) => s.classroom.topic);
  const loading = useAppSelector((s) => s.classroom.loading);
  const loadingStatus = useAppSelector((s) => s.classroom.loadingStatus);
  const isPlaying = useAppSelector((s) => s.classroom.isPlaying);
  const currentChunkIndex = useAppSelector((s) => s.classroom.currentChunkIndex);
  const chunks = useAppSelector((s) => s.classroom.chunks);
  const diagramType = useAppSelector((s) => s.classroom.diagramType);

  const progress =
    isPlaying && chunks.length > 0
      ? Math.round(((currentChunkIndex + 1) / chunks.length) * 100)
      : 0;

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/90 backdrop-blur shrink-0">
      {/* Left: Mobile Toggle + Status */}
      <div className="flex items-center gap-3 min-w-0">
        <MobileMenuButton />
        <div
          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
            loading
              ? 'bg-yellow-400 animate-pulse'
              : isPlaying
              ? 'bg-green-400 animate-pulse'
              : 'bg-slate-600'
          }`}
        />
        <span className="text-sm text-slate-300 truncate">
          {loading
            ? loadingStatus || 'Preparing lecture…'
            : isPlaying && topic
            ? `Lecturing: ${topic}`
            : topic || 'Ask a physics question to begin'}
        </span>
      </div>

      {/* Center: Progress bar */}
      {isPlaying && (
        <div className="flex-1 max-w-xs mx-6">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 text-right">
            {currentChunkIndex + 1} / {chunks.length}
          </p>
        </div>
      )}

      {/* Right: Diagram type badge & Q&A link */}
      <div className="flex items-center gap-3 shrink-0">
        {diagramType !== 'default' && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize">
            {diagramType.replace('_', ' ')}
          </span>
        )}
        <Link
          href="/ask"
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 hover:text-white transition-all shadow-sm"
        >
          💬 Ask Q&A
        </Link>
      </div>
    </header>
  );
}
