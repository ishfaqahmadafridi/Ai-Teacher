import type { SubtitleContainerProps } from '../../../types/classroom/classroom.types';
import SubtitleBar from './SubtitleBar';

export default function SubtitleContainer({
  isPlaying,
  spokenText,
  currentChunkIndex,
}: SubtitleContainerProps) {
  if (!isPlaying || !spokenText) return null;

  return (
    <div className="flex-shrink-0 bg-slate-950/60 border-t border-white/[0.06] py-3.5 px-6">
      <SubtitleBar
        text={spokenText}
        isPlaying={isPlaying}
        chunkIndex={currentChunkIndex}
      />
    </div>
  );
}
