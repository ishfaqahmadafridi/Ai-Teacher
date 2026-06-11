import { useEffect, useState } from 'react';
import { CHALK_CHAR_DELAY } from '../../utils/classroomConfig';

export function useChalkAnimation(text: string) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      setVisibleChars(current);
      if (current >= text.length) {
        clearInterval(interval);
      }
    }, CHALK_CHAR_DELAY);

    return () => {
      clearInterval(interval);
    };
  }, [text]);

  const done = visibleChars >= text.length;
  const visibleText = text.slice(0, visibleChars);

  return {
    visibleChars,
    visibleText,
    done,
  };
}
