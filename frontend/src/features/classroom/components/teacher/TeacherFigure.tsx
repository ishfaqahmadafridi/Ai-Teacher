'use client';

import { memo } from 'react';
import { useAppSelector } from '@/hooks/useAppStore';
import { TeacherGlowBackdrop } from './TeacherGlowBackdrop';
import { TeacherAvatarSvg } from './TeacherAvatarSvg';
import type { TeacherFigureProps } from './teacher.types';

export const TeacherFigure = memo(function TeacherFigure({
  className = '',
}: TeacherFigureProps) {
  const position = useAppSelector((s) => s.classroom.teacherPosition);
  const isWriting = useAppSelector((s) => s.classroom.isWritingOnBoard);
  const isPlaying = useAppSelector((s) => s.classroom.isPlaying);

  const posClass =
    position === 'left'
      ? 'left-6 lg:left-10 bottom-16 lg:bottom-20'
      : position === 'right'
      ? 'right-6 lg:right-10 bottom-16 lg:bottom-20'
      : 'left-1/2 -translate-x-1/2 bottom-16 lg:bottom-20';

  return (
    <div
      className={`absolute ${posClass} transition-all duration-700 ease-in-out select-none pointer-events-none z-20 flex flex-col items-center justify-end ${className}`}
      style={{ width: 140, height: 240 }}
    >
      {/* Ambient Lighting Voice Glow Aura */}
      <TeacherGlowBackdrop isActive={isPlaying} />

      {/* Teacher Vector Figure */}
      <TeacherAvatarSvg isPlaying={isPlaying} isWriting={isWriting} />
    </div>
  );
});

TeacherFigure.displayName = 'TeacherFigure';
