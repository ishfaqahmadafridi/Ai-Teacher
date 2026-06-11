import type { AskTypingIndicatorProps } from '../../../types/classroom/classroom.types';

export default function AskTypingIndicator({ loading }: AskTypingIndicatorProps) {
  if (!loading) return null;
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md flex-shrink-0">
        P
      </div>
      <div className="bg-slate-800/60 border border-white/[0.08] rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
        <div className="flex gap-1.5">
          {[0, 150, 300].map((d) => (
            <div
              key={d}
              className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
              style={{ animationDelay: `${d}ms` }}
            />
          ))}
        </div>
        <span className="text-xs text-slate-500 ml-1">Professor is thinking...</span>
      </div>
    </div>
  );
}
