interface NormalControlsProps {
  lectureMode: boolean;
  isPlaying: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  handleNewSession: () => void;
}

export default function NormalControls({
  lectureMode,
  isPlaying,
  voices,
  selectedVoice,
  setSelectedVoice,
  handleNewSession,
}: NormalControlsProps) {
  return (
    <>
      {!lectureMode && (
        <>
          <div className="hidden lg:block rounded-lg bg-white/5 border border-white/[0.08] px-2 py-1">
            <select
              value={selectedVoice}
              onChange={e => setSelectedVoice(e.target.value)}
              className="text-xs text-slate-300 bg-transparent outline-none cursor-pointer max-w-[130px]"
            >
              {voices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI} className="bg-slate-900 text-white">{v.name}</option>
              ))}
            </select>
          </div>
          <button onClick={handleNewSession} className="text-xs px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all">
            New Chat
          </button>
        </>
      )}
      {lectureMode && !isPlaying && (
        <button onClick={handleNewSession} className="text-xs px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all">
          New Chat
        </button>
      )}
    </>
  );
}
