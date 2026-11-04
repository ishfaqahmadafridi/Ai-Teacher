'use client';
import { readActiveLessonNote, saveActiveLessonNote } from '../utilities/activeLessonStorage';
import { classroomErrorMessage } from '../utilities/classroomErrors';
import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/state/authStore';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setNoteId, setPendingQuestion, setSpokenText, setError, setChunks, setTopic, setDiagramType, setCurrentChunkIndex, setChalkboardPoints, setCurrentCommand, setCurrentFormula } from '../state/classroomSlice';
import { lessonProgressService } from '../services/lessonProgressService';

export function useLessonRecovery() {
  const userId = useAuthStore(state => state.user?.id);
  const noteId = useAppSelector(state => state.classroom.noteId);
  const pending = useAppSelector(state => state.classroom.pendingQuestion);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!userId || noteId) return;
    const saved = readActiveLessonNote(userId);
    if (!saved) return;
    const controller = new AbortController();
    lessonProgressService.read(saved, controller.signal).then(progress => {
      if (controller.signal.aborted) return;
      dispatch(setChunks(progress.answer.chunks));
      dispatch(setTopic(progress.answer.topic));
      dispatch(setDiagramType(progress.answer.diagram_type));
      const diagram = progress.answer.chunks[progress.section_index]?.diagram;
      dispatch(setCurrentCommand(diagram ?? null));
      dispatch(setCurrentFormula(diagram?.formula ?? null));
      dispatch(setNoteId(saved));
      dispatch(setCurrentChunkIndex(progress.section_index));
      dispatch(setPendingQuestion(progress.waiting && progress.question ? { sectionIndex: progress.section_index, question: progress.question } : null));
      dispatch(setSpokenText(progress.question ?? ''));
      dispatch(setChalkboardPoints(progress.waiting && progress.question ? [progress.question] : []));
    }).catch(error => {
      if (!controller.signal.aborted) dispatch(setError(classroomErrorMessage(error, 'Unable to restore your lesson.')));
    });
    return () => controller.abort();
  }, [userId, noteId, dispatch]);
  useEffect(() => {
    if (!userId || !noteId) return;
    saveActiveLessonNote(userId, noteId);
    if (!pending) return;
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
