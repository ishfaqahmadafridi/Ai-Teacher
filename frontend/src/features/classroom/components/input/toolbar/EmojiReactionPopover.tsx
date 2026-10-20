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
        className="min-h-11 px-3 py-2 rounded-xl bg-dashboard-subtle hover:bg-dashboard-selected text-dashboard-text border border-dashboard-border hover:text-dashboard-primary text-xs font-semibold flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashboard-primary transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
        aria-expanded={showEmojiPicker}
        title="Reactions"
      >
        <Smile className="w-4 h-4 text-dashboard-muted" />
        <span>Reactions</span>
      </button>

      {/* Emoji Mart Library Popover Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-3 z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-150 rounded-2xl overflow-hidden border border-dashboard-border">
          <div className="flex items-center justify-between px-3 py-2 bg-dashboard-subtle text-xs text-dashboard-text">
            <span>Reactions</span>
            <button type="button" onClick={onTogglePicker} aria-label="Close reactions" className="rounded-lg p-1 hover:bg-dashboard-selected focus-visible:outline-2 focus-visible:outline-sky-400">
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
