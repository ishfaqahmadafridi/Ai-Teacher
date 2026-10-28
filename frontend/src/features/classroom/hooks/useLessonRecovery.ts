 'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/state/authStore';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setNoteId, setPendingQuestion, setSpokenText, setError, setChunks, setTopic, setDiagramType, setCurrentChunkIndex, setChalkboardPoints } from '../state/classroomSlice';
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
      if (controller.signal.aborted) return;
      dispatch(setChunks(progress.answer.chunks));
      dispatch(setTopic(progress.answer.topic));
      dispatch(setDiagramType(progress.answer.diagram_type));
      dispatch(setNoteId(saved));
      dispatch(setCurrentChunkIndex(progress.section_index));
      dispatch(setPendingQuestion(progress.waiting && progress.question ? { sectionIndex: progress.section_index, question: progress.question } : null));
      dispatch(setSpokenText(progress.question ?? ''));
      dispatch(setChalkboardPoints(progress.waiting && progress.question ? [progress.question] : []));
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
