'use client';
import { readActiveLessonNote, saveActiveLessonNote } from '../utilities/activeLessonStorage';
import { classroomErrorMessage } from '../utilities/classroomErrors';
import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/state/authStore';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setError } from '../state/classroomSlice';
import { useRestoreLesson } from './useRestoreLesson';
import { lessonProgressService } from '../services/lessonProgressService';

export function useLessonRecovery(enabled = true) {
  const restore = useRestoreLesson();
  const userId = useAuthStore(state => state.user?.id);
  const noteId = useAppSelector(state => state.classroom.noteId);
  const pending = useAppSelector(state => state.classroom.pendingQuestion);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!enabled || !userId || noteId) return;
    const saved = readActiveLessonNote(userId);
    if (!saved) return;
    const controller = new AbortController();
    restore(saved, controller.signal).catch(error => {
      if (!controller.signal.aborted) dispatch(setError(classroomErrorMessage(error, 'Unable to restore your lesson.')));
    });
    return () => controller.abort();
  }, [userId, noteId, dispatch, enabled, restore]);
  useEffect(() => {
    if (!userId || !noteId) return;
    saveActiveLessonNote(userId, noteId);
    if (!pending || pending.kind === 'discussion') return;
    const controller = new AbortController();
    lessonProgressService.read(noteId, controller.signal).then(progress => {
      if (progress.waiting && progress.section_index === pending.sectionIndex) return;
      return lessonProgressService.wait(noteId, pending.sectionIndex, progress.revision, controller.signal);
    }).catch(error => {
      if (!controller.signal.aborted) dispatch(setError(classroomErrorMessage(error, 'Unable to save your lesson position.')));
    });
    return () => controller.abort();
  }, [userId, noteId, pending, dispatch]);
}
