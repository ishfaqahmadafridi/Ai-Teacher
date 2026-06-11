import type { AskWelcomeScreenProps } from '../../../types/classroom/classroom.types';
import { ASK_SUGGESTIONS } from '../../../utils/classroomConfig';

export default function AskWelcomeScreen({ sendMessage }: AskWelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-6 py-12">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center">
        <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to Physics Class</h2>
        <p className="text-slate-400 max-w-md leading-relaxed text-sm">
          Ask Prof. Gemini any physics question. You'll get structured explanations with real
          examples, visual diagrams, step-by-step formulas, and a diagnostic question to check your
          understanding.
        </p>
      </div>
      {/* Mobile chips */}
      <div className="md:hidden flex flex-wrap gap-2 justify-center max-w-sm">
        {ASK_SUGGESTIONS.slice(0, 4).map((s) => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            className="text-xs px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
