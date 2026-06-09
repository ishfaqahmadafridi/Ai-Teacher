interface LectureControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  handlePause: () => void;
  handleStop: () => void;
}

export default function LectureControls({
  isPlaying,
  isPaused,
  handlePause,
  handleStop,
}: LectureControlsProps) {
  if (!isPlaying) return null;
  return (
    <>
      <button
        onClick={handlePause}
        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all font-medium
          ${isPaused
            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
            : 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'}`}
      >
        {isPaused ? (
          <><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>Resume</>
        ) : (
          <><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>Pause</>
        )}
      </button>
      <button
        onClick={handleStop}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white border border-red-500/40 transition-all font-medium"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
        Stop
      </button>
    </>
  );
}
