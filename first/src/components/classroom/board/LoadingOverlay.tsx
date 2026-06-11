import type { LoadingOverlayProps } from '../../../types/classroom/classroom.types';

export default function LoadingOverlay({ loading, loadingStatus }: LoadingOverlayProps) {
  if (!loading) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-blue-400/50 animate-ping" style={{ animationDelay: '150ms' }} />
          <div className="absolute inset-4 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        </div>
        <p className="text-white font-semibold text-sm">{loadingStatus}</p>
        <p className="text-slate-400 text-xs">Retrieving course materials…</p>
      </div>
    </div>
  );
}
