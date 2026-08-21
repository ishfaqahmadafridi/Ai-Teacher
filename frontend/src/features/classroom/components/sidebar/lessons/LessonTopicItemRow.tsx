'use client';

import { memo } from 'react';
import { useTopicItemRow } from '../../../hooks/useTopicItemRow';
import { TopicStatusDot } from './TopicStatusDot';
import { TopicItemTitle } from './TopicItemTitle';
import { TopicLiveBadge } from './TopicLiveBadge';
import type { LessonTopicItemRowProps } from '../../../types/sidebar.types';

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
      aria-current={isActive ? 'true' : undefined}
      className={buttonClassName}
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-2 flex-1">
        <TopicStatusDot isLive={topic.isLive} />
        <TopicItemTitle title={topic.title} isLive={topic.isLive} isActive={isActive} />
      </div>

      {topic.isLive && <TopicLiveBadge />}
    </button>
  );
});

LessonTopicItemRow.displayName = 'LessonTopicItemRow';
