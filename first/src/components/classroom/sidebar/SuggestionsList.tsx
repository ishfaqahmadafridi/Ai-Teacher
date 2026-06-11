import { SUGGESTIONS } from '../../../utils/classroomConfig';
import type { SuggestionsListProps } from '../../../types/classroom/classroom.types';

export default function SuggestionsList({
  askQuestion,
  loading,
  isPlaying,
}: SuggestionsListProps) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-1">Ask About…</p>
      <div className="flex flex-col gap-1.5">
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => askQuestion(s)}
            disabled={loading || isPlaying}
            className="text-left text-xs text-slate-300 hover:text-white px-3 py-2 rounded-xl
              hover:bg-white/10 border border-transparent hover:border-white/10
              transition-all leading-snug disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
