import type { KeyPointsPanelProps } from '../../../types/classroom/classroom.types';

export default function KeyPointsPanel({ isPlaying, chalkboardPoints }: KeyPointsPanelProps) {
  if (isPlaying || chalkboardPoints.length === 0) return null;

  return (
    <div
      className="hidden xl:flex flex-col w-64 border-l border-white/[0.06] flex-shrink-0"
      style={{ background: 'linear-gradient(160deg, #1a2a1a 0%, #0f1f0f 100%)' }}
    >
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Key Points</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {chalkboardPoints.map((point, i) => (
          <div key={i} className="flex gap-2 items-start" style={{ fontFamily: "'Caveat', cursive" }}>
            <span
              className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40
              flex items-center justify-center text-[10px] font-bold text-emerald-400"
            >
              {i + 1}
            </span>
            <p className="text-sm text-emerald-100/80 leading-relaxed">{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
