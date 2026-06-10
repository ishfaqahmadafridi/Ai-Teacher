import DiagramStage from './diagram/DiagramStage';
import ChalkText from '../../ChalkText';
import TeacherFigure from '../../TeacherFigure';
import WelcomeOverlay from './WelcomeOverlay';
import LoadingOverlay from './LoadingOverlay';
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
      {lectureMode && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 20% 20%, rgba(59,130,246,0.04) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.03) 0%, transparent 60%)
            `,
          }}
        />
      )}

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
