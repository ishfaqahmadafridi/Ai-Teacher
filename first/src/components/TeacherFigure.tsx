import { useEffect, useRef, useState } from 'react';
import type { TeacherPos, TeacherFigureProps } from '../types/classroom/classroom.types';
import { TEACHER_TARGET_X } from '../utils/classroomConfig';
import TeacherSvg from './classroom/teacher/TeacherSvg';
import SpeakingBubbles from './classroom/teacher/SpeakingBubbles';

export default function TeacherFigure({ position, isPlaying, isWriting }: TeacherFigureProps) {
  const [currentX, setCurrentX] = useState(TEACHER_TARGET_X[position]);
  const [bodyBob, setBodyBob] = useState(0);
  const prevPositionRef = useRef<TeacherPos>(position);
  const bobRef = useRef<number | null>(null);
  const frameRef = useRef(0);

  // -- Handle position changes -- smooth walk animation --------------------
  useEffect(() => {
    if (position === prevPositionRef.current) return;
    prevPositionRef.current = position;

    const targetX = TEACHER_TARGET_X[position];
    const startX = currentX;
    const dist = Math.abs(targetX - startX);
    const duration = Math.min(1400, 600 + dist * 8); // speed scales with distance
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // ease in-out cubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setCurrentX(startX + (targetX - startX) * eased);

      if (t < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentX(targetX);
      }
    };

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  // -- Idle body bob animation ----------------------------------------------
  useEffect(() => {
    if (!isPlaying) {
      if (bobRef.current) {
        clearInterval(bobRef.current);
        bobRef.current = null;
      }
      return;
    }
    let t = 0;
    bobRef.current = window.setInterval(() => {
      t += 0.1;
      setBodyBob(Math.sin(t) * 1.8);
    }, 40);
    return () => {
      if (bobRef.current) {
        clearInterval(bobRef.current);
        bobRef.current = null;
      }
    };
  }, [isPlaying]);

  if (!isPlaying) return null;

  // -- Determine visual state dynamically ------------------------------------
  const isWalking = Math.abs(currentX - TEACHER_TARGET_X[position]) > 0.1;
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
