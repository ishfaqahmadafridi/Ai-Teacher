'use client';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/state/authStore';
import { studyPlanToday } from '../utilities/studyPlanUtils';
import { DEFAULT_STUDY_PLAN_MONTHS } from '../constants/studyPlanConstants';
import { queryKeys } from '@/shared/constants/queryConstants';
import { parseOutlineTopics, validateOutlineTopics, cleanOutlineDetails, updateOutlineDetail } from '../utilities/courseOutlineUtils';
import { courseOutlineService } from '../services/courseOutlineService';
import type { CourseOutline, CourseOutlineTopicDetail, RegisteredCourseItem } from '../types/courses.types';

export function useCourseOutline(course: RegisteredCourseItem) {
  const client = useQueryClient();
  const userId = useAuthStore(state => state.user?.id);
  const educationLevel = useAuthStore(state => state.user?.educationLevel ?? '');
  const academicYear = useAuthStore(state => state.user?.academicYear ?? '');
  const gradeLevel = useAuthStore(state => state.user?.gradeLevel ?? '');
  const profileTimezone = useAuthStore(state => state.user?.timezone);
  const [startDate, setStartDate] = useState(studyPlanToday(profileTimezone));
  const [durationMonths, setDurationMonths] = useState(DEFAULT_STUDY_PLAN_MONTHS);
  const [weeks, setWeeks] = useState<NonNullable<CourseOutline['weeks']>>([]);
  const [text, setText] = useState('');
  const [details, setDetails] = useState<CourseOutlineTopicDetail[]>([]);
  const [sessions, setSessions] = useState<CourseOutline['sessions']>([]);
  const [source, setSource] = useState<CourseOutline['source']>('manual');
  const [busy, setBusy] = useState<'loading' | 'generating' | 'saving' | null>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isStudyPlanOpen, setStudyPlanOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    request.current = controller;
    courseOutlineService.read(course.id, controller.signal).then(outline => {
      if (controller.signal.aborted || useAuthStore.getState().user?.id !== userId) return;
      setText(outline.topics.join('\n'));
      setWeeks(outline.weeks ?? []);
      setDetails(outline.details); setSessions(outline.sessions);
      setSource(outline.source || 'manual');
      setSaved(outline.topics.length > 0 && Boolean(outline.period));
      if (outline.period) { setStartDate(outline.period.start_date); setDurationMonths(outline.period.duration_months); }
    }).catch(() => { if (!controller.signal.aborted) setError('Unable to load the outline. Close this window and try again.'); })
      .finally(() => { if (!controller.signal.aborted) setBusy(null); });
    return () => { controller.abort(); request.current?.abort(); };
  }, [course.id, userId]);
  const run = async (generate: boolean) => {
    if (busy || !userId) return;
    const topics = parseOutlineTopics(text);
    const validationError = !generate ? validateOutlineTopics(topics) : null;
    if (validationError) { setError(validationError); return; }
    if (!startDate) { setError('Choose a start date for the course plan.'); return; }
    const period = { start_date: startDate, duration_months: durationMonths };
    const controller = new AbortController(); request.current = controller;
    setBusy(generate ? 'generating' : 'saving'); setError(null); setSaved(false);
    try {
      const outline = generate ? await courseOutlineService.generate(course.id, controller.signal, period)
        : await courseOutlineService.save(course.id, { period, topics, source: source || 'manual', details: cleanOutlineDetails(details, topics) }, controller.signal);
      if (controller.signal.aborted || useAuthStore.getState().user?.id !== userId) return;
      setText(outline.topics.join('\n'));
      setDetails(outline.details); setSessions(outline.sessions); setSource(outline.source); setWeeks(outline.weeks ?? []);
      if (!generate) {
        setSaved(true);
        await Promise.all([
          client.invalidateQueries({ queryKey: queryKeys.dashboard(userId) }),
          client.invalidateQueries({ queryKey: ['timetable-courses', userId] }),
          client.invalidateQueries({ queryKey: ['course-study-plan', userId, course.id] }),
        ]);
      }
    } catch (error) {
      const detail = axios.isAxiosError(error) ? error.response?.data?.detail : undefined;
      if (!controller.signal.aborted) setError(typeof detail === 'string' ? detail : generate ? 'AI could not create an outline. Try again or enter your own topics.' : 'The outline could not be saved. Please try again.');
    } finally { if (!controller.signal.aborted) setBusy(null); }
  };
  return { isStudyPlanOpen, openStudyPlan: () => setStudyPlanOpen(true), closeStudyPlan: () => setStudyPlanOpen(false), startDate, durationMonths, weeks,
    updateStartDate: (value: string) => { setStartDate(value); setSaved(false); setWeeks([]); },
    updateDurationMonths: (value: number) => { setDurationMonths(value); setSaved(false); setWeeks([]); },
    text, source, busy, error, saved, details, sessions,
    educationLevel: educationLevel.replaceAll('_', ' '), academicYear, gradeLevel,
    topics: parseOutlineTopics(text),
    updateDetail: (title: string, field: 'subtopics' | 'exercises', value: string) => {
      setDetails(previous => updateOutlineDetail(previous, title, field, value));
      setSaved(false); setWeeks([]);
    },
    updateText: (value: string) => { setText(value); setSaved(false); setWeeks([]); },
    useManual: () => { setSource('manual'); setSaved(false); },
    generate: () => run(true), save: () => run(false),
  };
}
