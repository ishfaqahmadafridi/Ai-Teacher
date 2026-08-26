'use client';

import { memo } from 'react';
import { X } from 'lucide-react';
import { useInputBarToasts } from '../../../hooks/useInputBarToasts';

export const InputBarToasts = memo(function InputBarToasts() {
  const { voiceError, localError, reactionToast, clearErrors } = useInputBarToasts();

  return (
    <>
      {/* Voice or System Error Banner */}
      {(voiceError || localError) && (
        <div className="text-red-300 text-xs bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-lg backdrop-blur-md">
          <span className="font-medium">{voiceError ?? localError}</span>
          <button
            type="button"
            className="text-red-400 hover:text-white transition-colors cursor-pointer"
            onClick={clearErrors}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Reaction Toast Notification */}
      {reactionToast && (
        <div className="self-center px-4 py-1.5 rounded-full bg-slate-900/95 border border-violet-500/40 text-xs font-medium text-violet-300 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex items-center gap-2 backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
          <span>{reactionToast}</span>
        </div>
      )}
    </>
  );
});

InputBarToasts.displayName = 'InputBarToasts';
