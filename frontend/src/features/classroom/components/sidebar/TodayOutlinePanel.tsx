'use client';

import { memo } from 'react';
import type { TodayOutlinePanelProps } from '../../types/sidebar.types';
import { DEFAULT_LESSON_TOPICS, DEFAULT_ACTIVE_TOPIC_ID } from '../../constants/sidebarConstants';
import { useTodayOutlinePanel } from '../../hooks/useTodayOutlinePanel';
import { OutlineAgendaHeader, OutlineTopicList } from './outline';

export const TodayOutlinePanel = memo(function TodayOutlinePanel({
  topics = DEFAULT_LESSON_TOPICS,
  activeTopicId = DEFAULT_ACTIVE_TOPIC_ID,
  onSelectTopic,
  className = '',
}: TodayOutlinePanelProps) {
  const {
    topics: listTopics,
    activeTopicId: currentActiveId,
    handleSelect,
  } = useTodayOutlinePanel({ topics, activeTopicId, onSelectTopic });

  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Agenda Header */}
      <OutlineAgendaHeader topicCount={listTopics.length} />

      {/* Topics Timeline List */}
      <OutlineTopicList
        topics={listTopics}
        activeTopicId={currentActiveId}
        onSelectTopic={(id) => handleSelect(id)}
      />
    </div>
  );
});

TodayOutlinePanel.displayName = 'TodayOutlinePanel';
