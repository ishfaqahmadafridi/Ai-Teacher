import type { AskListenButtonProps } from '../../../types/classroom/classroom.types';

export default function AskListenButton({
  msgId,
  msgContent,
  speakingId,
  toggleSpeak,
}: AskListenButtonProps) {
  return (
    <button
      onClick={() => toggleSpeak(msgId, msgContent)}
      className={`flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full border transition-all
        ${
          speakingId === msgId
            ? 'bg-red-500/20 border-red-500/40 text-red-400'
            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
        }`}
    >
      {speakingId === msgId ? (
        <>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
          Stop
        </>
      ) : (
        <>
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-4.5-9l4.5-4.5 4.5 4.5"
            />
          </svg>
          Listen
        </>
      )}
    </button>
  );
}
