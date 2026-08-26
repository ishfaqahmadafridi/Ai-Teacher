'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import { Smile } from 'lucide-react';
import data from '@emoji-mart/data';
import type { EmojiReactionPopoverProps } from '../../../types/input.types';

// Dynamic client-only import for Emoji Mart picker to prevent SSR 500 errors
const Picker = dynamic(() => import('@emoji-mart/react'), { ssr: false });

export const EmojiReactionPopover = memo(function EmojiReactionPopover({
  showEmojiPicker,
  onTogglePicker,
  onSendReaction,
  className = '',
}: EmojiReactionPopoverProps) {
  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={onTogglePicker}
        className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
        title="Reactions"
      >
        <Smile className="w-4 h-4 text-violet-400" />
        <span>Reactions</span>
      </button>

      {/* Emoji Mart Library Popover Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-3 z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-150 rounded-2xl overflow-hidden border border-slate-700/80">
          <Picker
            data={data}
            onEmojiSelect={(emojiData: { native: string; name: string }) => {
              onSendReaction(emojiData.native, emojiData.name || 'Reaction');
            }}
            theme="dark"
            previewPosition="none"
            skinTonePosition="none"
            perLine={7}
          />
        </div>
      )}
    </div>
  );
});

EmojiReactionPopover.displayName = 'EmojiReactionPopover';
