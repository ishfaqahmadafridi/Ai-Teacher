'use client';

import { useEffect, useRef } from 'react';

/** Dismiss an open classroom surface without treating internal clicks as outside. */
export function useClassroomDismiss(isOpen: boolean, onClose: () => void) {
  const surfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (surfaceRef.current && !event.composedPath().includes(surfaceRef.current)) onClose();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return surfaceRef;
}
