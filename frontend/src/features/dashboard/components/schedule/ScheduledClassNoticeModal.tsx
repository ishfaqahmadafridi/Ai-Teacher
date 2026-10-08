'use client';

import { memo } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { useAuthStore } from '@/features/auth/state/authStore';
import { useScheduleClock } from '../../hooks/useScheduleClock';
import { getScheduleAccess } from '../../utilities/scheduleAccess';
import { ScheduledClassNoticeHeader } from './ScheduledClassNoticeHeader';
import { ScheduledClassNoticeDetails } from './ScheduledClassNoticeDetails';
import { ScheduledClassAccessNotice } from './ScheduledClassAccessNotice';
import type { ScheduledClassNoticeModalProps } from '../../types/schedule.types';

export const ScheduledClassNoticeModal = memo(function ScheduledClassNoticeModal({

  isOpen,
  item,
  onClose,
}: ScheduledClassNoticeModalProps) {
  const timezone = useAuthStore((state) => state.user?.timezone || '');
  const now = useScheduleClock();
  if (!isOpen || !item) return null;
  const access = getScheduleAccess(item, timezone, new Date(now || Date.now()));

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%_-_2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 max-h-[calc(100dvh_-_2rem)] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-5 outline-none">
        <ScheduledClassNoticeHeader
          title={access.ended || item.status === 'completed' ? 'Session ended' : access.canJoin ? 'Session is ready' : 'Your session is scheduled'}
          onClose={onClose}
        />
        <ScheduledClassNoticeDetails item={item} />
        <ScheduledClassAccessNotice item={item} timezone={timezone} access={access} />

        {/* Footer Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            Back to schedule
          </button>
        </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

ScheduledClassNoticeModal.displayName = 'ScheduledClassNoticeModal';
