'use client';

import { memo } from 'react';
import { useActiveLessonTree } from '../../../hooks/useActiveLessonTree';
import { LessonTreeHeader } from './LessonTreeHeader';
import { LessonTopicItemRow } from './LessonTopicItemRow';
import type { ActiveLessonTreeProps, LessonTopicItem } from '../../../types/sidebar.types';

export const ActiveLessonTree = memo(function ActiveLessonTree({
  moduleTitle,
  topics,
  activeTopicId,
  onSelectTopic,
}: ActiveLessonTreeProps) {
  const {
    isExpanded,
    title,
    topics: resolvedTopics,
    toggleExpand,
    handleSelectTopic,
  } = useActiveLessonTree({
    moduleTitle,
    topics,
    activeTopicId,
    onSelectTopic,
  });

  return (
    <div className="space-y-3">
      <LessonTreeHeader
        title={title}
        isExpanded={isExpanded}
        onToggle={toggleExpand}
      />

      {isExpanded && (
        <div className="space-y-1.5 pl-2 border-l border-white/10 ml-2">
          {resolvedTopics.map((topic: LessonTopicItem) => (
            <LessonTopicItemRow
              key={topic.id}
              topic={topic}
              isActive={activeTopicId === topic.id}
              onSelectTopic={handleSelectTopic}
            />
          ))}
        </div>
      )}
    </div>
  );
});

ActiveLessonTree.displayName = 'ActiveLessonTree';
