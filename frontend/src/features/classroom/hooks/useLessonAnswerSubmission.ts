'use client';
import { useCallback, useEffect, useRef } from 'react';
import { lectureNotesService } from '../services/lectureNotesService';
import type { PendingLessonQuestion } from '../types/classroom.types';
import type { LessonAnswerRequest } from '../types/api.types';

export function useLessonAnswerSubmission(noteId: string | null) {
  const requestRef = useRef<LessonAnswerRequest | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), [noteId]);

  return useCallback(async (question: PendingLessonQuestion, answer: string) => {
    if (!noteId) return null;
    const key = JSON.stringify([noteId, question.sectionIndex, answer]);
    if (requestRef.current?.key !== key) requestRef.current = { key, id: crypto.randomUUID() };
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const attempt = await lectureNotesService.answer(noteId, question.sectionIndex, answer, requestRef.current.id, controller.signal);
    controller.signal.throwIfAborted();
    const evaluation = await lectureNotesService.evaluate(noteId, attempt.id, controller.signal);
    controller.signal.throwIfAborted();
    requestRef.current = null;
    return evaluation;
  }, [noteId]);
}
