'use client';

import dynamic from 'next/dynamic';

/**
 * Dynamic client-only loader for 3D Canvas DiagramStage to eliminate WebGL SSR errors
 * following AGENTS.md Five-Folder Architecture rules.
 */
export const DynamicDiagramStage = dynamic(
  () => import('@/features/classroom/components/board/diagram/DiagramStage').then((mod) => mod.DiagramStage),
  { ssr: false }
);

/**
 * Dynamic client-only loader for EmojiReactionPopover to prevent @emoji-mart SSR errors
 */
export const DynamicEmojiReactionPopover = dynamic(
  () => import('@/features/classroom/components/input/toolbar/EmojiReactionPopover').then((mod) => mod.EmojiReactionPopover),
  { ssr: false }
);
