'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useBoardFullscreen() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const sync = () => setIsFullscreen(document.fullscreenElement === boardRef.current);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [expanded]);

  const toggleFullscreen = useCallback(async () => {
    if (expanded) { setExpanded(false); return; }
    if (document.fullscreenElement === boardRef.current) {
      await document.exitFullscreen();
      return;
    }
    if (!boardRef.current) return;
    try {
      if (!boardRef.current.requestFullscreen) { setExpanded(true); return; }
      await boardRef.current.requestFullscreen();
    } catch {
      // Embedded browsers may deny native fullscreen; expand within the viewport.
      setExpanded(true);
    }
  }, [expanded]);

  return { boardRef, isFullscreen: isFullscreen || expanded, expanded, toggleFullscreen };
}
