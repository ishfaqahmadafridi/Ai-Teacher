import type { AskGotItButtonProps } from '../../../types/classroom/classroom.types';

export default function AskGotItButton({ sendMessage }: AskGotItButtonProps) {
  return (
    <button
      onClick={() => sendMessage('Yes, I understood! Please continue.')}
      className="flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 bg-white/5 transition-all"
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Got it, continue!
    </button>
  );
}
