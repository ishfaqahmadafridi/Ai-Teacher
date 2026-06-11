import { SUGGESTIONS } from '../../../utils/classroomConfig';
import type { MobileSuggestionsProps } from '../../../types/classroom/classroom.types';

export default function MobileSuggestions({ askQuestion }: MobileSuggestionsProps) {
  return (
    <div className="lg:hidden flex flex-wrap gap-2 justify-center max-w-sm">
      {SUGGESTIONS.slice(0, 4).map(s => (
        <button
          key={s}
          onClick={() => askQuestion(s)}
          className="text-xs px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
