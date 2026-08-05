'use client';

import { memo } from 'react';
import { useActiveLessonTree } from '../../hooks/useActiveLessonTree';
import { LessonTreeHeader } from './LessonTreeHeader';
import { LessonTopicItemRow } from './LessonTopicItemRow';
import type { ActiveLessonTreeProps } from '../../types/sidebar.types';

export const ActiveLessonTree = memo(function ActiveLessonTree({
  moduleTitle,
  topics,
  activeTopicId,
  onSelectTopic,
}: ActiveLessonTreeProps) {
  const {
    isExpanded,
    title,
    topics: activeTopics,
    activeTopicId: currentActiveId,
    toggleExpand,
    handleSelectTopic,
  } = useActiveLessonTree({ moduleTitle, topics, activeTopicId, onSelectTopic });

  return (
    <div className="bg-[#2e5bff]/10 border border-[#2e5bff]/20 rounded-xl overflow-hidden shadow-sm">
      {/* Collapsible Header */}
      <LessonTreeHeader
        title={title}
        isExpanded={isExpanded}
        onToggle={toggleExpand}
      />

      {/* Topics list */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-2 space-y-2">
          {activeTopics.map((topic) => (
            <LessonTopicItemRow
              key={topic.id}
              topic={topic}
              isActive={topic.id === currentActiveId}
              onSelectTopic={handleSelectTopic}
            />
          ))}
        </div>
      )}
    </div>
  );
});

ActiveLessonTree.displayName = 'ActiveLessonTree';
