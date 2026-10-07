'use client';
import { useRef, useEffect } from 'react';
import data from '@emoji-mart/data';
import type { EmojiReactionPopoverProps } from '../types/input.types';
import { EMOJI_PICKER_OPTIONS } from '../constants/inputConstants';
export function useEmojiReactionPicker(show: boolean, onSendReaction: EmojiReactionPopoverProps['onSendReaction']) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!show || !container) return;
    let active = true;
    let picker: HTMLElement | undefined;
    void import('emoji-mart').then(({ Picker }) => {
      if (!active) return;
      picker = new Picker({ ...EMOJI_PICKER_OPTIONS, data,
        onEmojiSelect: (emoji: { native: string; name: string }) => onSendReaction(emoji.native, emoji.name || 'Reaction'),
      }) as unknown as HTMLElement;
      container.appendChild(picker);
    });
    return () => { active = false; picker?.remove(); };
  }, [show, onSendReaction]);
  return containerRef;
}
