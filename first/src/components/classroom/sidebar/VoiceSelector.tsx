import type { VoiceSelectorProps } from '../../../types/classroom/classroom.types';

export default function VoiceSelector({
  voices,
  selectedVoice,
  setSelectedVoice,
}: VoiceSelectorProps) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/[0.08] p-3">
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Professor Voice</p>
      <select
        value={selectedVoice}
        onChange={e => setSelectedVoice(e.target.value)}
        className="w-full text-xs text-slate-200 bg-transparent outline-none cursor-pointer"
      >
        {voices.map(v => (
          <option key={v.voiceURI} value={v.voiceURI} className="bg-slate-900 text-white">
            {v.name}
          </option>
        ))}
      </select>
    </div>
  );
}
