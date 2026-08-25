'use client';

import { memo } from 'react';
import type { OutlineTopicListProps } from '../../../types/sidebar.types';
import { OutlineTopicCard } from './OutlineTopicCard';

export const OutlineTopicList = memo(function OutlineTopicList({
  topics,
  activeTopicId,
  onSelectTopic,
  className = '',
}: OutlineTopicListProps) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {topics.map((topic, index) => {
        const isActive = topic.id === activeTopicId;
        const isCompleted = index < 2;

        return (
          <OutlineTopicCard
            key={topic.id}
            topic={topic}
            index={index}
            isActive={isActive}
            isCompleted={isCompleted}
            onSelectTopic={onSelectTopic}
          />
        );
      })}
    </div>
  );
});

OutlineTopicList.displayName = 'OutlineTopicList';
