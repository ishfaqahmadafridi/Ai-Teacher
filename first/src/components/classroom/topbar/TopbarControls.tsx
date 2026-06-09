import type { TopbarControlsProps } from '../../../types/classroom/classroom.types';
import ProgressDots from './ProgressDots';
import LectureControls from './LectureControls';
import NormalControls from './NormalControls';

export default function TopbarControls({
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
}: TopbarControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <ProgressDots
        isPlaying={isPlaying}
        chunks={chunks}
        currentChunkIndex={currentChunkIndex}
      />

      <LectureControls
        isPlaying={isPlaying}
        isPaused={isPaused}
        handlePause={handlePause}
        handleStop={handleStop}
      />

      <NormalControls
        lectureMode={lectureMode}
        isPlaying={isPlaying}
        voices={voices}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        handleNewSession={handleNewSession}
      />
    </div>
  );
}
