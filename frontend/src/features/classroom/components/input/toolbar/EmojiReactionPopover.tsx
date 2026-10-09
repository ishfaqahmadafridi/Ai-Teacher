'use client';

import { memo } from 'react';
import { Smile, X } from 'lucide-react';
import { useClassroomDismiss } from '../../../hooks/useClassroomDismiss';
import { useEmojiReactionPicker } from '../../../hooks/useEmojiReactionPicker';
import type { EmojiReactionPopoverProps } from '../../../types/input.types';

export const EmojiReactionPopover = memo(function EmojiReactionPopover({
  showEmojiPicker,
  onTogglePicker,
  onSendReaction,
  className = '',
}: EmojiReactionPopoverProps) {
  const pickerRef = useEmojiReactionPicker(showEmojiPicker, onSendReaction);
  const surfaceRef = useClassroomDismiss(showEmojiPicker, onTogglePicker);
  return (
    <div ref={surfaceRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={onTogglePicker}
        className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
        aria-expanded={showEmojiPicker}
        title="Reactions"
      >
        <Smile className="w-4 h-4 text-violet-400" />
        <span>Reactions</span>
      </button>

      {/* Emoji Mart Library Popover Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-3 z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-150 rounded-2xl overflow-hidden border border-slate-700/80">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900 text-xs text-slate-200">
            <span>Reactions</span>
            <button type="button" onClick={onTogglePicker} aria-label="Close reactions" className="rounded-lg p-1 hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-sky-400">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div ref={pickerRef} />
        </div>
      )}
    </div>
  );
});

EmojiReactionPopover.displayName = 'EmojiReactionPopover';
