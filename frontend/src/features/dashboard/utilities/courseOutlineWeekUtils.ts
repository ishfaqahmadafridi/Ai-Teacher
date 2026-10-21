import type { CourseOutlineWeekItem, CourseOutlineWeekTopic } from '../types/courses.types';

/** Combine lesson and practice fragments under one topic within a week. */
export function groupCourseWeekTopics(items: CourseOutlineWeekItem[]): CourseOutlineWeekTopic[] {
  const topics = new Map<string, CourseOutlineWeekTopic>();
  for (const item of items) {
    const key = item.title.trim().toLocaleLowerCase();
    const topic = topics.get(key) ?? { title: item.title, subtopics: [], exercises: [], assignments: [], activities: [] };
    topic.subtopics = [...new Set([...topic.subtopics, ...item.subtopics])];
    topic.exercises = [...new Set([...topic.exercises, ...item.exercises])];
    for (const assignment of item.assignments ?? []) {
      if (!topic.assignments.some(value => value.exercise === assignment.exercise)) topic.assignments.push(assignment);
    }
    topic.activities = [...new Set([...topic.activities, item.activity])];
    topics.set(key, topic);
  }
  return [...topics.values()];
}
