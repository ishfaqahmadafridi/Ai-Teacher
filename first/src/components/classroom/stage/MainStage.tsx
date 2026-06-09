import Topbar from '../topbar/Topbar';
import BoardArea from '../board/BoardArea';
import InputBar from '../input/InputBar';
import SubtitleContainer from './SubtitleContainer';
import ErrorBar from './ErrorBar';
import VoiceErrorBar from './VoiceErrorBar';
import type { MainStageProps } from '../../../types/classroom/classroom.types';

export default function MainStage({
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
  askQuestion,
  currentCommand,
  currentFormula,
  chalkboardPoints,
  teacherPosition,
  isWritingOnBoard,
  spokenText,
  error,
  setError,
  voiceError,
  isListening,
  inputText,
  setInputText,
  handleMicClick,
}: MainStageProps) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar
        topic={topic}
        diagramType={diagramType}
        loading={loading}
        loadingStatus={loadingStatus}
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

      <BoardArea
        lectureMode={lectureMode}
        chunks={chunks}
        loading={loading}
        loadingStatus={loadingStatus}
        askQuestion={askQuestion}
        diagramType={diagramType}
        currentCommand={currentCommand}
        currentFormula={currentFormula}
        chalkboardPoints={chalkboardPoints}
        isPlaying={isPlaying}
        teacherPosition={teacherPosition}
        isWritingOnBoard={isWritingOnBoard}
      />
      <SubtitleContainer
        isPlaying={isPlaying}
        spokenText={spokenText}
        currentChunkIndex={currentChunkIndex}
      />

      <ErrorBar
        error={error}
        setError={setError}
      />

      <VoiceErrorBar
        voiceError={voiceError}
      />

      <InputBar
        lectureMode={lectureMode}
        loading={loading}
        isListening={isListening}
        inputText={inputText}
        setInputText={setInputText}
        askQuestion={askQuestion}
        handleMicClick={handleMicClick}
      />
    </div>
  );
}
