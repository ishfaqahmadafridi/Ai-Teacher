import type { AskSidebarProps } from '../../../types/classroom/classroom.types';
import { ASK_SUGGESTIONS } from '../../../utils/classroomConfig';

export default function AskSidebar({ sendMessage, handleNewChat }: AskSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-white/[0.06] bg-black/20 p-4 gap-3 flex-shrink-0">
      {/* Professor card */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-700/20 border border-blue-500/20 p-4 text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <p className="font-bold text-white text-sm">Prof. Gemini</p>
        <p className="text-xs text-blue-300/80 mt-0.5">Physics Professor</p>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400">Online</span>
        </div>
      </div>

      {/* Topic suggestions */}
      <div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-1">
          Suggested Topics
        </p>
        <div className="flex flex-col gap-1.5">
          {ASK_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-left text-xs text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 leading-snug"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* New chat */}
      <div className="mt-auto">
        <button
          onClick={handleNewChat}
          className="w-full py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-600 hover:to-indigo-600 rounded-xl transition-all border border-blue-500/30 shadow-md"
        >
          + New Session
        </button>
      </div>
    </aside>
  );
}
