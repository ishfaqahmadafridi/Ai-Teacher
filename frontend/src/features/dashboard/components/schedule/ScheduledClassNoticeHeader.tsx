import { Dialog } from '@base-ui/react/dialog';
import { Clock, X } from 'lucide-react';

export function ScheduledClassNoticeHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center text-[#38BDF8] shrink-0 shadow-lg shadow-[#2563EB]/10">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-medium text-slate-400">
            Class availability
          </span>
          <Dialog.Title className="text-lg font-semibold text-white mt-1 leading-snug">
            {title}
          </Dialog.Title>
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
  );
}
