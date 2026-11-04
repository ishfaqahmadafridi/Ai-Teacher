'use client';
import { useCallback, useEffect, useRef } from 'react';
import { lectureNotesService } from '../services/lectureNotesService';
import type { PendingLessonQuestion } from '../types/classroom.types';
import type { LessonAnswerRequest } from '../types/api.types';

export function useDiscussionSubmission(noteId: string | null) {
  const request = useRef<LessonAnswerRequest | null>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), [noteId]);
  return useCallback(async (pending: PendingLessonQuestion, question: string) => {
    if (!noteId) return null;
    const key = JSON.stringify([noteId, pending.sectionIndex, question]);
    if (request.current?.key !== key) request.current = { key, id: crypto.randomUUID() };
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    const response = await lectureNotesService.discuss(noteId, pending.sectionIndex, question, request.current.id, current.signal);
    current.signal.throwIfAborted();
    request.current = null;
    return response;
  }, [noteId]);
}
