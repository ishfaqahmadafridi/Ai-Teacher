import type { AskChatSettingsProps } from '../../../types/classroom/classroom.types';

export default function AskChatSettings({
  voices,
  selectedVoice,
  setSelectedVoice,
  autoSpeak,
  setAutoSpeak,
  handleNewChat,
}: AskChatSettingsProps) {
  return (
    <div className="flex items-center gap-3">
      <select
        value={selectedVoice ?? ''}
        onChange={(e) => setSelectedVoice(e.target.value)}
        className="text-xs text-slate-300 bg-transparent border-b border-white/10 outline-none max-w-[100px] truncate py-1"
      >
        {voices.map((v) => (
          <option key={v.uri ?? v.name} value={v.uri ?? v.name} className="bg-slate-900">
            {v.name}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
        <input
          type="checkbox"
          checked={autoSpeak}
          onChange={(e) => setAutoSpeak(e.target.checked)}
          className="accent-blue-500"
        />
        <span>Auto-speak</span>
      </label>
      <button
        onClick={handleNewChat}
        className="md:hidden text-xs px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white"
      >
        New Chat
      </button>
    </div>
  );
}
