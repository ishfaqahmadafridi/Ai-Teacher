'use client';
import { useCallback } from 'react';
import { useAppDispatch } from '@/hooks/useAppStore';
import { setNoteId, setPendingQuestion, setSpokenText, setChunks, setTopic, setDiagramType, setCurrentChunkIndex, setChalkboardPoints, setCurrentCommand, setCurrentFormula } from '../state/classroomSlice';
import { lessonProgressService } from '../services/lessonProgressService';

export function useRestoreLesson() {
  const dispatch = useAppDispatch();
  return useCallback(async (noteId: string, signal: AbortSignal) => {
    const progress = await lessonProgressService.read(noteId, signal);
    if (signal.aborted) return;
    const diagram = progress.answer.chunks[progress.section_index]?.diagram;
    dispatch(setChunks(progress.answer.chunks));
    dispatch(setTopic(progress.answer.topic));
    dispatch(setDiagramType(progress.answer.diagram_type));
    dispatch(setCurrentCommand(diagram ?? null));
    dispatch(setCurrentFormula(diagram?.formula ?? null));
    dispatch(setNoteId(noteId));
    dispatch(setCurrentChunkIndex(progress.section_index));
    const discussion = !!progress.answer.chunks[progress.section_index]?.discussion_prompt;
    const remaining = progress.discussion_expires_at && progress.server_now
      ? Date.parse(progress.discussion_expires_at) - Date.parse(progress.server_now) : 0;
    dispatch(setPendingQuestion(progress.waiting && progress.question ? {
      sectionIndex: progress.section_index, question: progress.question,
      ...(discussion ? { kind: 'discussion' as const, expiresAt: Date.now() + Math.max(0, remaining) } : {}),
    } : null));
    dispatch(setSpokenText(progress.question ?? ''));
    dispatch(setChalkboardPoints(progress.waiting && progress.question ? [progress.question] : []));
  }, [dispatch]);
}
