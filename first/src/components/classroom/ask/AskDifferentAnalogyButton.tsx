import type { AskDifferentAnalogyButtonProps } from '../../../types/classroom/classroom.types';

export default function AskDifferentAnalogyButton({
  sendMessage,
}: AskDifferentAnalogyButtonProps) {
  return (
    <button
      onClick={() => sendMessage("I don't understand, please explain differently.")}
      className="flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-white/20 bg-white/5 transition-all"
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Different analogy
    </button>
  );
}
