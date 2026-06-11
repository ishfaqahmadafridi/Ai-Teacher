import type { SidebarProps } from '../../../types/classroom/classroom.types';
import ProfessorCard from './ProfessorCard';
import VoiceSelector from './VoiceSelector';
import SuggestionsList from './SuggestionsList';

export default function Sidebar({
  loading,
  isPlaying,
  loadingStatus,
  voices,
  selectedVoice,
  setSelectedVoice,
  askQuestion,
  handleNewSession,
  lectureMode,
}: SidebarProps) {
  return (
    <aside
      className={`flex-col w-64 xl:w-72 border-r border-white/[0.06] bg-black/20 p-4 gap-4 flex-shrink-0
        transition-all duration-500 overflow-hidden
        ${lectureMode ? 'hidden' : 'hidden lg:flex'}`}
    >
      <ProfessorCard
        loading={loading}
        loadingStatus={loadingStatus}
        isPlaying={isPlaying}
      />

      <VoiceSelector
        voices={voices}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
      />

      <SuggestionsList
        askQuestion={askQuestion}
        loading={loading}
        isPlaying={isPlaying}
      />

      {/* Controls */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleNewSession}
          className="w-full py-2 text-sm font-semibold text-white
            bg-gradient-to-r from-blue-600/80 to-indigo-600/80
            hover:from-blue-600 hover:to-indigo-600 rounded-xl transition-all
            border border-blue-500/30"
        >
          + New Session
        </button>
      </div>
    </aside>
  );
}
