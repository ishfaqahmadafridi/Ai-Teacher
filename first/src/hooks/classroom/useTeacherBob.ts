import { useEffect, useRef, useState } from 'react';

export function useTeacherBob(isPlaying: boolean) {
  const [prevIsPlaying, setPrevIsPlaying] = useState(isPlaying);
  const [bodyBob, setBodyBob] = useState(0);
  const bobRef = useRef<number | null>(null);

  // Reset bob height during render if playing state toggles off
  if (isPlaying !== prevIsPlaying) {
    setPrevIsPlaying(isPlaying);
    if (!isPlaying) {
      setBodyBob(0);
    }
  }

  useEffect(() => {
    if (!isPlaying) return;

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

  return bodyBob;
}
