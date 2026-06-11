import type { ProfessorCardProps } from '../../../types/classroom/classroom.types';

export default function ProfessorCard({
  loading,
  loadingStatus,
  isPlaying,
}: ProfessorCardProps) {
  return (
    <div className="rounded-2xl p-4 text-center bg-gradient-to-br from-blue-600/15 to-indigo-700/15 border border-blue-500/20">
      <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <p className="font-bold text-white">Prof. Gemini</p>
      <p className="text-xs text-blue-300/80 mt-0.5">AI Teacher Assistant</p>
      <div className="flex items-center justify-center gap-1.5 mt-2">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            loading
              ? 'bg-amber-400 animate-pulse'
              : isPlaying
              ? 'bg-yellow-400 animate-pulse'
              : 'bg-emerald-400 animate-pulse'
          }`}
        />
        <span
          className={`text-xs ${
            loading ? 'text-amber-400' : isPlaying ? 'text-yellow-400' : 'text-emerald-400'
          }`}
        >
          {loading ? loadingStatus : isPlaying ? 'Teaching…' : 'Ready'}
        </span>
      </div>
    </div>
  );
}
