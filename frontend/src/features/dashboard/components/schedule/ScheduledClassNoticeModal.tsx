'use client';

import { memo } from 'react';
import { Clock, Calendar, X, AlertCircle, User, MapPin } from 'lucide-react';
import type { ScheduleItem } from '../../types/schedule.types';

export interface ScheduledClassNoticeModalProps {
  isOpen: boolean;
  item: ScheduleItem | null;
  onClose: () => void;
}

export const ScheduledClassNoticeModal = memo(function ScheduledClassNoticeModal({
  isOpen,
  item,
  onClose,
}: ScheduledClassNoticeModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-[#0] z-50 bg-[#030712]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#0F172A] border border-[#1E293B] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative overflow-hidden font-['Hanken_Grotesk',sans-serif]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Background Glow */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#2563EB]/15 blur-3xl pointer-events-none" />

        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center text-[#38BDF8] shrink-0 shadow-lg shadow-[#2563EB]/10">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#38BDF8] bg-[#2563EB]/20 px-2.5 py-0.5 rounded-full border border-[#2563EB]/30">
                Scheduled Session
              </span>
              <h3 className="text-xl font-bold text-white mt-1 leading-tight">
                Class Not Live Yet
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Class Info Box */}
        <div className="bg-[#0B132B] border border-[#1E293B] rounded-2xl p-5 space-y-3">
          <div>
            <span className="text-[11px] font-semibold text-[#38BDF8] uppercase tracking-wide">
              {item.subject}
            </span>
            <h4 className="text-base font-bold text-white mt-0.5 leading-snug">
              {item.title}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#1E293B]/80 text-xs">
            <div className="flex items-center gap-2 text-[#94A3B8]">
              <Calendar className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <div>
                <span className="text-[10px] text-[#64748B] block uppercase font-bold">Schedule Day</span>
                <span className="text-white font-medium">{item.dayOfWeek}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#94A3B8]">
              <Clock className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <div>
                <span className="text-[10px] text-[#64748B] block uppercase font-bold">Time Slot</span>
                <span className="text-[#38BDF8] font-mono font-bold">{item.timeSlot || item.timeFormatted}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#94A3B8]">
              <User className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <div>
                <span className="text-[10px] text-[#64748B] block uppercase font-bold">Instructor</span>
                <span className="text-white font-medium">{item.instructorName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#94A3B8]">
              <MapPin className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <div>
                <span className="text-[10px] text-[#64748B] block uppercase font-bold">Room / Hall</span>
                <span className="text-white font-medium">{item.roomOrLink}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Notice Box */}
        <div className="bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-2xl p-4 text-xs text-[#CBD5E1] flex items-start gap-3 leading-relaxed">
          <AlertCircle className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-white">Live Access Notice</p>
            <p className="mt-0.5 text-[#94A3B8]">
              This live class is not active right now. Classroom access opens <strong>5 minutes before class starts</strong>. Please return on <strong className="text-white">{item.dayOfWeek}</strong> at <strong className="text-[#38BDF8]">{item.timeSlot || item.timeFormatted}</strong> to join the live session.
            </p>
          </div>
        </div>

        {/* Footer Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#2563eb]/25 transition-all cursor-pointer active:scale-95 border border-[#38BDF8]/30"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
});

ScheduledClassNoticeModal.displayName = 'ScheduledClassNoticeModal';
