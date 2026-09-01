'use client';

import { memo } from 'react';
import { BookOpen, Calendar, Clock, User, MapPin, Tag } from 'lucide-react';
import { useCreateScheduleSlotModal } from '../../hooks/useCreateScheduleSlotModal';
import { CreateScheduleSlotHeader } from './CreateScheduleSlotHeader';
import { CreateScheduleSlotFooter } from './CreateScheduleSlotFooter';
import type {
  CreateScheduleSlotModalProps,
  DayOfWeek,
} from '../../types/schedule.types';

export const CreateScheduleSlotModal = memo(
  function CreateScheduleSlotModal({
    isOpen,
    onClose,
    onAddScheduleSlot,
  }: CreateScheduleSlotModalProps) {
    const {
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
      subjectOptions,
      dayOptions,
      timeSlotOptions,
    } = useCreateScheduleSlotModal({
      onClose,
      onAddScheduleSlot,
    });

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-xl p-6 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <CreateScheduleSlotHeader onClose={onClose} />

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Class Topic / Title */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                Session Topic / Class Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mechanics & Wave Dynamics"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* 2. Course / Subject */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                Course / Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                {subjectOptions.map((subj) => (
                  <option key={subj} value={subj} className="bg-slate-900 text-white">
                    {subj}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Day of Week & Time Slot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Day of Week
                </label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                >
                  {dayOptions.map((day) => (
                    <option key={day} value={day} className="bg-slate-900 text-white">
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-yellow-400" />
                  Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                >
                  {timeSlotOptions.map((slot) => (
                    <option key={slot} value={slot} className="bg-slate-900 text-white">
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Instructor & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  Instructor Name
                </label>
                <input
                  type="text"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  Room or Session Link
                </label>
                <input
                  type="text"
                  value={roomOrLink}
                  onChange={(e) => setRoomOrLink(e.target.value)}
                  placeholder="e.g. Room 402B • Science Hall"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* 5. Status */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Initial Class Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('upcoming')}
                  className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all ${
                    status === 'upcoming'
                      ? 'bg-blue-600/20 border-blue-500/80 text-blue-300 ring-1 ring-blue-500/50'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('live')}
                  className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all ${
                    status === 'live'
                      ? 'bg-emerald-600/20 border-emerald-500/80 text-emerald-300 ring-1 ring-emerald-500/50'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Live Session
                </button>
              </div>
            </div>

            {/* Footer */}
            <CreateScheduleSlotFooter onClose={onClose} />
          </form>
        </div>
      </div>
    );
  }
);

CreateScheduleSlotModal.displayName = 'CreateScheduleSlotModal';
