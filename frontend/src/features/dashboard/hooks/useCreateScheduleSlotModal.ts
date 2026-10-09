'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/services/dashboardService';
import { useAuthStore } from '@/features/auth/state/authStore';
import {
  DEFAULT_CREATE_SCHEDULE_SLOT_FORM,
  DAYS_OF_WEEK,
  SCHEDULE_TIME_SLOTS,
} from '../constants/scheduleConstants';
import type {
  DayOfWeek,
  ScheduleItem,
  UseCreateScheduleSlotModalOptions,
} from '../types/schedule.types';

export function useCreateScheduleSlotModal(
  options: UseCreateScheduleSlotModalOptions
) {
  const { onClose, onAddScheduleSlot } = options;

  const userId = useAuthStore((state) => state.user?.id);
  const courses = useQuery({ queryKey: ['timetable-courses', userId], queryFn: () => DashboardService.getCourses(), enabled: Boolean(userId) });
  const [title, setTitle] = useState(DEFAULT_CREATE_SCHEDULE_SLOT_FORM.title);
  const [subject, setSubject] = useState(DEFAULT_CREATE_SCHEDULE_SLOT_FORM.subject);
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(
    DEFAULT_CREATE_SCHEDULE_SLOT_FORM.dayOfWeek
  );
  const [timeSlot, setTimeSlot] = useState(
    DEFAULT_CREATE_SCHEDULE_SLOT_FORM.timeSlot
  );
  const [instructorName, setInstructorName] = useState(
    DEFAULT_CREATE_SCHEDULE_SLOT_FORM.instructorName
  );
  const [roomOrLink, setRoomOrLink] = useState(
    DEFAULT_CREATE_SCHEDULE_SLOT_FORM.roomOrLink
  );
  const [status, setStatus] = useState<'upcoming' | 'live' | 'completed'>(
    DEFAULT_CREATE_SCHEDULE_SLOT_FORM.status
  );
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setTitle(DEFAULT_CREATE_SCHEDULE_SLOT_FORM.title);
    setSubject(DEFAULT_CREATE_SCHEDULE_SLOT_FORM.subject);
    setDayOfWeek(DEFAULT_CREATE_SCHEDULE_SLOT_FORM.dayOfWeek);
    setTimeSlot(DEFAULT_CREATE_SCHEDULE_SLOT_FORM.timeSlot);
    setInstructorName(DEFAULT_CREATE_SCHEDULE_SLOT_FORM.instructorName);
    setRoomOrLink(DEFAULT_CREATE_SCHEDULE_SLOT_FORM.roomOrLink);
    setStatus(DEFAULT_CREATE_SCHEDULE_SLOT_FORM.status);
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) {
        setError('Please enter a valid class topic or session title.');
        return;
      }
      if (!instructorName.trim()) {
        setError('Please specify the instructor name.');
        return;
      }

      const newItem: ScheduleItem = {
        id: crypto.randomUUID(),
        title: title.trim(),
        subject,
        dayOfWeek,
        timeFormatted: timeSlot,
        timeSlot,
        instructorName: instructorName.trim(),
        roomOrLink: roomOrLink.trim() || 'Online Virtual Lecture Room',
        status,
      };

      try {
        await onAddScheduleSlot(newItem);
        resetForm();
        onClose();
      } catch { setError('Unable to save the slot. Check the course and time range.'); }
    },
    [
      title,
      subject,
      dayOfWeek,
      timeSlot,
      instructorName,
      roomOrLink,
      status,
      onAddScheduleSlot,
      resetForm,
      onClose,
    ]
  );

  return {
    title,
    setTitle,
    subject,
    setSubject,
    dayOfWeek,
    setDayOfWeek,
    timeSlot,
    setTimeSlot,
    instructorName,
    setInstructorName,
    roomOrLink,
    setRoomOrLink,
    status,
    setStatus,
    error,
    handleSubmit,
    resetForm,
    subjectOptions: courses.data?.map((course) => course.title) ?? [],
    dayOptions: DAYS_OF_WEEK,
    timeSlotOptions: SCHEDULE_TIME_SLOTS,
  };
}
