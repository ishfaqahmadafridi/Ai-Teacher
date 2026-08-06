'use client';

import { memo } from 'react';
import { useTopicItemRow } from '../../hooks/useTopicItemRow';
import { TopicStatusDot } from './TopicStatusDot';
import { TopicItemTitle } from './TopicItemTitle';
import { TopicLiveBadge } from './TopicLiveBadge';
import type { LessonTopicItemRowProps } from '../../types/sidebar.types';

export const LessonTopicItemRow = memo(function LessonTopicItemRow({
  topic,
  isActive,
  onSelectTopic,
  className = '',
}: LessonTopicItemRowProps) {
  const { handleClick, buttonClassName } = useTopicItemRow(
    topic,
    isActive,
    onSelectTopic,
    className
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={topic.isDisabled}
      aria-disabled={topic.isDisabled}
      className={buttonClassName}
    >
      {/* Status Dot Sub-component */}
      <TopicStatusDot isLive={topic.isLive} />

      {/* Topic Title Sub-component */}
      <TopicItemTitle title={topic.title} isLive={topic.isLive} isActive={isActive} />

      {/* LIVE Badge Sub-component */}
      {topic.isLive && <TopicLiveBadge />}
    </button>
  );
});

LessonTopicItemRow.displayName = 'LessonTopicItemRow';
