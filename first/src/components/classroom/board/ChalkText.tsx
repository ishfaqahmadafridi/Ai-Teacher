import { useEffect, useRef } from 'react';
import type { ChalkTextProps } from '../../../types/classroom/classroom.types';
import ChalkPoint from './ChalkPoint';

export default function ChalkText({ points, isPlaying }: ChalkTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // -- Scroll container to bottom as new points appear ----------------------
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [points.length]);

  if (!isPlaying || points.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute top-3 left-3 z-20 pointer-events-none overflow-y-auto max-h-[45%]"
      style={{ maxWidth: '38%' }}
    >
      {points.map((text, i) => (
        <ChalkPoint key={i} text={text} index={i} />
      ))}
    </div>
  );
}
