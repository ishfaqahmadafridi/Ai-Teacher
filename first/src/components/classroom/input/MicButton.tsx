interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
}

export default function MicButton({ isListening, onClick }: MicButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-shrink-0 w-12 h-12 rounded-2xl border transition-all flex items-center justify-center shadow-md
        ${isListening
          ? 'bg-red-500/80 border-red-500/60 shadow-red-900/40 animate-pulse'
          : 'bg-white/10 border-white/10 hover:bg-white/20 hover:border-white/20'
        }`}
    >
      <svg className={`w-5 h-5 ${isListening ? 'text-white' : 'text-slate-300'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    </button>
  );
}
