 'use client';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/state/authStore';
import { queryKeys } from '@/shared/constants/queryConstants';
import { courseOutlineService } from '../services/courseOutlineService';
import type { CourseOutline, RegisteredCourseItem } from '../types/courses.types';

export function useCourseOutline(course: RegisteredCourseItem) {
  const client = useQueryClient();
  const userId = useAuthStore(state => state.user?.id);
  const [text, setText] = useState('');
  const [source, setSource] = useState<CourseOutline['source']>('manual');
  const [busy, setBusy] = useState<'loading' | 'generating' | 'saving' | null>('loading');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    request.current = controller;
    courseOutlineService.read(course.id, controller.signal).then(outline => {
      if (controller.signal.aborted || useAuthStore.getState().user?.id !== userId) return;
      setText(outline.topics.join('\n'));
      setSource(outline.source || 'manual');
    }).catch(() => { if (!controller.signal.aborted) setError('Unable to load the outline. Close this window and try again.'); })
      .finally(() => { if (!controller.signal.aborted) setBusy(null); });
    return () => { controller.abort(); request.current?.abort(); };
  }, [course.id, userId]);
  const run = async (generate: boolean) => {
    if (busy || !userId) return;
    const topics = text.split('\n').map(line => line.trim()).filter(Boolean);
    if (!generate && (!topics.length || topics.length > 60 || topics.some(topic => topic.length > 255))) {
      setError('Enter 1–60 topics, one per line, with no more than 255 characters each.'); return;
    }
    if (!generate && new Set(topics.map(topic => topic.toLowerCase())).size !== topics.length) {
      setError('Remove duplicate topics before saving.'); return;
    }
    const controller = new AbortController(); request.current = controller;
    setBusy(generate ? 'generating' : 'saving'); setError(null); setSaved(false);
    try {
      const outline = generate ? await courseOutlineService.generate(course.id, controller.signal)
        : await courseOutlineService.save(course.id, { topics, source: source || 'manual' }, controller.signal);
      if (controller.signal.aborted || useAuthStore.getState().user?.id !== userId) return;
      setText(outline.topics.join('\n')); setSource(outline.source);
      if (!generate) {
        setSaved(true);
        await client.invalidateQueries({ queryKey: queryKeys.dashboard(userId) });
      }
    } catch {
      if (!controller.signal.aborted) setError(generate ? 'AI could not create an outline. Try again or enter your own topics.' : 'The outline could not be saved. Please try again.');
    } finally { if (!controller.signal.aborted) setBusy(null); }
  };
  return { text, source, busy, error, saved,
    updateText: (value: string) => { setText(value); setSaved(false); },
    useManual: () => { setSource('manual'); setSaved(false); },
    generate: () => run(true), save: () => run(false),
  };
}
