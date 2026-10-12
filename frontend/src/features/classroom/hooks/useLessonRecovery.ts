 'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/state/authStore';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setNoteId, setPendingQuestion, setSpokenText, setError } from '../state/classroomSlice';
import { lessonProgressService } from '../services/lessonProgressService';

export function useLessonRecovery() {
  const userId = useAuthStore(state => state.user?.id);
  const noteId = useAppSelector(state => state.classroom.noteId);
  const pending = useAppSelector(state => state.classroom.pendingQuestion);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!userId || noteId) return;
    const saved = localStorage.getItem(`classroom-active-note:${userId}`);
    if (!saved) return;
    const controller = new AbortController();
    lessonProgressService.read(saved, controller.signal).then(progress => {
      if (controller.signal.aborted || !progress.waiting || !progress.question) return;
      dispatch(setNoteId(saved));
      dispatch(setPendingQuestion({ sectionIndex: progress.section_index, question: progress.question }));
      dispatch(setSpokenText(progress.question));
    }).catch(error => {
      if (!controller.signal.aborted) dispatch(setError(error instanceof Error ? error.message : 'Unable to restore your lesson.'));
    });
    return () => controller.abort();
  }, [userId, noteId, dispatch]);
  useEffect(() => {
    if (!userId || !noteId) return;
    localStorage.setItem(`classroom-active-note:${userId}`, noteId);
    if (!pending) return;
    const controller = new AbortController();
    lessonProgressService.read(noteId, controller.signal).then(progress => {
      if (progress.waiting && progress.section_index === pending.sectionIndex) return;
      return lessonProgressService.wait(noteId, pending.sectionIndex, progress.revision, controller.signal);
    }).catch(error => {
      if (!controller.signal.aborted) dispatch(setError(error instanceof Error ? error.message : 'Unable to save your lesson position.'));
    });
    return () => controller.abort();
  }, [userId, noteId, pending, dispatch]);
}
