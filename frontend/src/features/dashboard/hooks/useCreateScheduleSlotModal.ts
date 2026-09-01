'use client';

import { useState, useCallback } from 'react';
import {
  DEFAULT_CREATE_SCHEDULE_SLOT_FORM,
  AVAILABLE_SUBJECT_OPTIONS,
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
    (e: React.FormEvent) => {
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
        id: `custom-slot-${Date.now()}`,
        title: title.trim(),
        subject,
        dayOfWeek,
        timeFormatted: timeSlot,
        timeSlot,
        instructorName: instructorName.trim(),
        roomOrLink: roomOrLink.trim() || 'Online Virtual Lecture Room',
        status,
      };

      onAddScheduleSlot(newItem);
      resetForm();
      onClose();
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
    subjectOptions: AVAILABLE_SUBJECT_OPTIONS,
    dayOptions: DAYS_OF_WEEK,
    timeSlotOptions: SCHEDULE_TIME_SLOTS,
  };
}
