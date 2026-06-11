import { useEffect, useRef, useState } from 'react';
import type { TeacherPos } from '../../types/classroom/classroom.types';
import { TEACHER_TARGET_X } from '../../utils/classroomConfig';

export function useTeacherWalk(position: TeacherPos) {
  const [currentX, setCurrentX] = useState(TEACHER_TARGET_X[position]);
  const prevPositionRef = useRef<TeacherPos>(position);
  const frameRef = useRef(0);

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

  const isWalking = Math.abs(currentX - TEACHER_TARGET_X[position]) > 0.1;

  return {
    currentX,
    isWalking,
  };
}
