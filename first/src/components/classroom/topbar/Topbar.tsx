import type { TopbarProps } from '../../../types/classroom/classroom.types';
import TopicPill from './TopicPill';
import LoadingIndicator from './LoadingIndicator';
import TopbarControls from './TopbarControls';

export default function Topbar({
  topic,
  diagramType,
  loading,
  loadingStatus,
  isPlaying,
  chunks,
  currentChunkIndex,
  isPaused,
  handlePause,
  handleStop,
  lectureMode,
  voices,
  selectedVoice,
  setSelectedVoice,
  handleNewSession,
}: TopbarProps) {
  return (
    <div
      className={`flex items-center justify-between px-5 py-3 border-b border-white/[0.06] flex-shrink-0 transition-all duration-500
        ${lectureMode ? 'bg-black/40 backdrop-blur-sm' : 'bg-black/10'}`}
    >
      <div className="flex items-center gap-2">
        <TopicPill topic={topic} diagramType={diagramType} />
        <LoadingIndicator loading={loading} loadingStatus={loadingStatus} />
      </div>

      <TopbarControls
        isPlaying={isPlaying}
        chunks={chunks}
        currentChunkIndex={currentChunkIndex}
        isPaused={isPaused}
        handlePause={handlePause}
        handleStop={handleStop}
        lectureMode={lectureMode}
        voices={voices}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        handleNewSession={handleNewSession}
      />
    </div>
  );
}
