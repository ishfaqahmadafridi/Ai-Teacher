import DiagramStage from './diagram/DiagramStage';
import ChalkText from './ChalkText';
import TeacherFigure from '../teacher/TeacherFigure';
import WelcomeOverlay from './WelcomeOverlay';
import LoadingOverlay from './LoadingOverlay';
import ChalkboardBackground from './ChalkboardBackground';
import type { ChalkboardStageProps } from '../../../types/classroom/classroom.types';

export default function ChalkboardStage({
  lectureMode,
  chunks,
  loading,
  loadingStatus,
  askQuestion,
  diagramType,
  currentCommand,
  currentFormula,
  chalkboardPoints,
  isPlaying,
  teacherPosition,
  isWritingOnBoard,
}: ChalkboardStageProps) {
  return (
    <div
      className="relative flex-1 min-h-0 transition-all duration-700"
      style={{
        background: lectureMode ? 'linear-gradient(160deg, #0a1628 0%, #050c18 100%)' : 'transparent',
      }}
    >
      {/* Subtle chalkboard texture overlay in lecture mode */}
      <ChalkboardBackground lectureMode={lectureMode} />

      {/* Welcome overlay */}
      <WelcomeOverlay chunks={chunks} loading={loading} askQuestion={askQuestion} />

      {/* Loading overlay */}
      <LoadingOverlay loading={loading} loadingStatus={loadingStatus} />

      {/* 3D Diagram -- always rendered, takes full space */}
      <DiagramStage diagramType={diagramType} command={currentCommand} formula={currentFormula} />

      {/* Live chalk key-points on board -- top-left corner */}
      <ChalkText points={chalkboardPoints} isPlaying={isPlaying} />

      {/* Animated teacher figure at bottom */}
      <TeacherFigure position={teacherPosition} isPlaying={isPlaying} isWriting={isWritingOnBoard} />
    </div>
  );
}
