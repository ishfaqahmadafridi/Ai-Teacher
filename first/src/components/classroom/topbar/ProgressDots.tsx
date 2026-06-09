import type { ExtendedChunk } from '../../../types/classroom/classroom.types';

interface ProgressDotsProps {
  isPlaying: boolean;
  chunks: ExtendedChunk[];
  currentChunkIndex: number;
}

export default function ProgressDots({ isPlaying, chunks, currentChunkIndex }: ProgressDotsProps) {
  if (!isPlaying || chunks.length === 0) return null;
  return (
    <div className="hidden sm:flex items-center gap-1.5">
      {chunks.map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === currentChunkIndex
              ? 'w-4 h-2 bg-blue-400'
              : i < currentChunkIndex
              ? 'w-2 h-2 bg-blue-600/60'
              : 'w-2 h-2 bg-white/10'
          }`}
        />
      ))}
    </div>
  );
}
