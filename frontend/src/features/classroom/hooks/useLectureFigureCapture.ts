'use client';
import { LECTURE_FIGURE_CAPTURE_DELAY_MS } from '../constants/notesConstants';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/hooks/useAppStore';
import { isImageUrl } from '../utilities/imageUtils';
import { captureLectureCanvas } from '../utilities/lectureFigureCapture';
import { saveLectureFigure } from '../services/lectureNotesService';

/** Capture rendered diagrams for the saved note; failure never interrupts speech. */
export function useLectureFigureCapture() {
  const queryClient = useQueryClient();
  const noteId = useAppSelector(state => state.classroom.noteId);
  const index = useAppSelector(state => state.classroom.currentChunkIndex);
  const type = useAppSelector(state => state.classroom.diagramType);
  const target = useAppSelector(state => state.classroom.currentCommand?.target);
  useEffect(() => {
    if (!noteId || index < 0 || (type === 'default' && !isImageUrl(target ?? ''))) return;
    const controller = new AbortController();
    const frame = setTimeout(() => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-lecture-diagram] canvas');
      if (!canvas) return;
      try {
        const image = captureLectureCanvas(canvas);
        if (!image) return;
        void saveLectureFigure(noteId, index, image, controller.signal).then(() => queryClient.invalidateQueries({ queryKey: ['lecture-notes'] })).catch(() => {
          if (!controller.signal.aborted) console.warn('The lecture diagram could not be saved to notes.');
        });
      } catch { console.warn('The lecture diagram could not be captured.'); }
    }, LECTURE_FIGURE_CAPTURE_DELAY_MS);
    return () => { clearTimeout(frame); controller.abort(); };
  }, [noteId, index, type, target, queryClient]);
}
