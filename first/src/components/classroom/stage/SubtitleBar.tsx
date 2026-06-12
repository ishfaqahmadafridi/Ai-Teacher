import { useEffect, useState } from 'react';
import type { SubtitleBarProps } from '../../../types/classroom/classroom.types';
import SubtitleAvatar from './SubtitleAvatar';
import SubtitleWave from './SubtitleWave';
import SubtitleBubble from './SubtitleBubble';

export default function SubtitleBar({ text, isPlaying, chunkIndex }: SubtitleBarProps) {
  const [prevChunkIndex, setPrevChunkIndex] = useState(chunkIndex);
  const [visible, setVisible] = useState(false);

  // Reset visibility if chunk changes
  if (chunkIndex !== prevChunkIndex) {
    setPrevChunkIndex(chunkIndex);
    setVisible(false);
  }

  // Trigger fade-in transition
  useEffect(() => {
    if (isPlaying && !visible && text) {
      const timer = setTimeout(() => setVisible(true), 60);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, visible, text]);

  if (!isPlaying || !text) return null;

  return (
    <div
      className="w-full z-20 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(5px)',
      }}
    >
      <div className="mx-auto max-w-3xl">
        <SubtitleBubble>
          <div className="flex items-start gap-3">
            {/* Prof avatar */}
            <SubtitleAvatar />

            {/* Text */}
            <p className="text-white text-sm leading-relaxed font-medium flex-1">{text}</p>

            {/* Speaking wave indicator */}
            <SubtitleWave />
          </div>
        </SubtitleBubble>
      </div>
    </div>
  );
}
