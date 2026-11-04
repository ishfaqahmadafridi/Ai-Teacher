'use client';
import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setHandRaised, setPendingQuestion, setDiscussionExpired, setCurrentChunkIndex, setInputText, setError } from '../state/classroomSlice';
import { lessonHandService } from '../services/lessonHandService';
import { lessonProgressService } from '../services/lessonProgressService';
import { useChunkPlayer } from './useChunkPlayer';

/** Only concept Q&A is timed; graded checks retain their own feedback policy. */
export function useDiscussionWindow() {
  const { pendingQuestion: pending, noteId, discussionExpired, answerSubmitting } = useAppSelector(state => state.classroom);
  const dispatch = useAppDispatch();
  const { playFrom, stop, playReply } = useChunkPlayer();
  const advanceRef = useRef<AbortController | null>(null);
  useEffect(() => () => advanceRef.current?.abort(), []);

  useEffect(() => {
    if (!noteId || pending?.kind !== 'discussion' || pending.expiresAt !== undefined) return;
    const controller = new AbortController();
    void (async () => {
      const hand = await lessonHandService.read(noteId, controller.signal);
      if (hand.hand_raised && !controller.signal.aborted) {
        await lessonHandService.set(noteId, false, controller.signal);
        if (controller.signal.aborted) return;
        dispatch(setHandRaised(false));
        await playReply(hand.invitation);
        if (controller.signal.aborted) return;
      }
      const existing = await lessonProgressService.read(noteId, controller.signal);
      const progress = existing.waiting && existing.section_index === pending.sectionIndex
        ? existing : await lessonProgressService.wait(noteId, pending.sectionIndex, existing.revision, controller.signal);
      if (controller.signal.aborted) return;
      if (!progress.discussion_expires_at || !progress.server_now) throw new Error('Question period unavailable');
      const remaining = Date.parse(progress.discussion_expires_at) - Date.parse(progress.server_now);
      dispatch(setPendingQuestion({ ...pending, expiresAt: Date.now() + Math.max(0, remaining) }));
    })().catch(() => {
      if (controller.signal.aborted) return;
      dispatch(setError('The question period could not open. Continuing the lesson.'));
      dispatch(setDiscussionExpired(true));
    });
    return () => controller.abort();
  }, [pending, noteId, dispatch, playReply]);

  useEffect(() => {
    if (pending?.kind !== 'discussion' || pending.expiresAt === undefined) return;
    const timer = setTimeout(() => dispatch(setDiscussionExpired(true)), Math.max(0, pending.expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [pending, dispatch]);

  useEffect(() => {
    if (pending?.kind !== 'discussion' || !discussionExpired || answerSubmitting) return;
    const next = pending.sectionIndex + 1;
    const controller = new AbortController();
    advanceRef.current?.abort();
    advanceRef.current = controller;
    stop();
    dispatch(setPendingQuestion(null));
    dispatch(setInputText(''));
    dispatch(setCurrentChunkIndex(next));
    const saved = noteId ? lessonProgressService.finish(noteId, next, controller.signal) : Promise.resolve();
    void saved.catch(() => {
      if (!controller.signal.aborted) dispatch(setError('The lesson continues, but its position could not be saved.'));
    }).finally(() => { if (!controller.signal.aborted) playFrom(next); });
  }, [pending, discussionExpired, answerSubmitting, noteId, stop, playFrom, dispatch]);
}
