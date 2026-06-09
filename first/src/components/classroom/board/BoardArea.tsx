import ChalkboardStage from './ChalkboardStage';
import KeyPointsPanel from './KeyPointsPanel';
import type { BoardAreaProps } from '../../../types/classroom/classroom.types';

export default function BoardArea(props: BoardAreaProps) {
  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* 3D Diagram + Teacher + Chalk overlay */}
      <ChalkboardStage {...props} />

      {/* Key points side panel */}
      <KeyPointsPanel isPlaying={props.isPlaying} chalkboardPoints={props.chalkboardPoints} />
    </div>
  );
}
