interface TopicPillProps {
  topic: string;
  diagramType: string;
}

export default function TopicPill({ topic, diagramType }: TopicPillProps) {
  if (topic) {
    return (
      <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 font-medium capitalize">
        {topic.replace(/_/g, ' ')}
      </span>
    );
  }
  if (diagramType !== 'default') {
    return (
      <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 font-medium capitalize">
        {diagramType.replace('_', ' ')}
      </span>
    );
  }
  return null;
}
