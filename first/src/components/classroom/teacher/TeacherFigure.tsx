import type { TeacherFigureProps } from '../../../types/classroom/classroom.types';
import { useTeacherWalk } from '../../../hooks/classroom/useTeacherWalk';
import { useTeacherBob } from '../../../hooks/classroom/useTeacherBob';
import TeacherSvg from './TeacherSvg';
import SpeakingBubbles from './SpeakingBubbles';

export default function TeacherFigure({ position, isPlaying, isWriting }: TeacherFigureProps) {
  const { currentX, isWalking } = useTeacherWalk(position);
  const bodyBob = useTeacherBob(isPlaying);

  if (!isPlaying) return null;

  // -- Determine visual state dynamically ------------------------------------
  const armAngle = isWriting ? -70 : 0;
  const bobY = isPlaying ? bodyBob : 0;
  const facingRight = position !== 'right';
  const flip = facingRight ? 1 : -1;

  return (
    <div
      className="absolute bottom-0 transition-none pointer-events-none z-30"
      style={{
        left: `${currentX}%`,
        transform: `translateY(0)`,
        width: '64px',
        transition: 'left 0s', // JS-driven animation
      }}
    >
      <TeacherSvg
        bodyBob={bobY}
        armAngle={armAngle}
        isWriting={isWriting}
        isWalking={isWalking}
        flip={flip}
      />

      {/* Speaking indicator bubbles above head */}
      {!isWriting && (
        <SpeakingBubbles bodyBob={bobY} facingRight={facingRight} />
      )}
    </div>
  );
}
