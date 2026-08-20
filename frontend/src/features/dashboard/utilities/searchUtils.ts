import type {
  SearchResultItem,
  SearchGroupedResults,
} from '../types/topbar.types';
import type { RegisteredCourseItem } from '../types/courses.types';
import type { AssignmentItem, LiveClassItem } from '../types/dashboard.types';

export function searchDashboardItems(
  rawQuery: string,
  courses: RegisteredCourseItem[] = [],
  assignments: AssignmentItem[] = [],
  liveClasses: LiveClassItem[] = []
): SearchGroupedResults {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return {
      courses: [],
      assignments: [],
      liveClasses: [],
      topics: [],
      totalCount: 0,
    };
  }

  // 1. Filter Courses
  const courseResults: SearchResultItem[] = courses
    .filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.subjectField.toLowerCase().includes(query) ||
        c.courseCode.toLowerCase().includes(query)
    )
    .map((c) => ({
      id: c.id,
      type: 'course' as const,
      title: c.title,
      subtitle: `${c.courseCode} • ${c.subjectField} (${c.progressPercent}% Complete)`,
      badgeText: 'Course',
      actionPayload: {
        targetTab: 'dashboard',
        courseId: c.id,
      },
    }));

  // 2. Filter Assignments & Quizzes
  const assignmentResults: SearchResultItem[] = assignments
    .filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.subject.toLowerCase().includes(query) ||
        (a.type ? a.type.toLowerCase().includes(query) : false)
    )
    .map((a) => ({
      id: a.id,
      type: 'assignment' as const,
      title: a.title,
      subtitle: `${a.subject} • ${a.dueDate} (${a.points} pts)`,
      badgeText: a.type === 'quiz' ? 'Quiz' : 'Assignment',
      actionPayload: {
        targetTab: 'assignments_quizzes',
        taskId: a.id,
      },
    }));

  // 3. Filter Live Classes
  const liveClassResults: SearchResultItem[] = liveClasses
    .filter(
      (lc) =>
        lc.title.toLowerCase().includes(query) ||
        lc.subject.toLowerCase().includes(query) ||
        lc.instructorName.toLowerCase().includes(query)
    )
    .map((lc) => ({
      id: lc.id,
      type: 'live_class' as const,
      title: lc.title,
      subtitle: `${lc.subject} • ${lc.instructorName} (${lc.timeFormatted})`,
      badgeText: lc.isLive ? 'LIVE NOW' : 'Live Class',
      actionPayload: {
        targetTab: 'schedule',
        classId: lc.id,
      },
    }));

  // 4. Default Topics & Modules matching query
  const mockTopicsList = [
    { title: 'Neural Networks & Deep Learning', code: 'AI-MOD-01', subject: 'Artificial Intelligence' },
    { title: 'Data Structures: Hash Tables & Trees', code: 'CS-MOD-04', subject: 'Computer Science' },
    { title: 'Relational Database Schema Design', code: 'IT-MOD-02', subject: 'Information Technology' },
    { title: 'Algorithm Complexity & Big-O Notation', code: 'CS-MOD-02', subject: 'Computer Science' },
  ];

  const topicResults: SearchResultItem[] = mockTopicsList
    .filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.code.toLowerCase().includes(query)
    )
    .map((t, idx) => ({
      id: `topic_${idx}`,
      type: 'topic' as const,
      title: t.title,
      subtitle: `${t.code} • ${t.subject}`,
      badgeText: 'Topic',
      actionPayload: {
        targetTab: 'dashboard',
      },
    }));

  const totalCount =
    courseResults.length +
    assignmentResults.length +
    liveClassResults.length +
    topicResults.length;

  return {
    courses: courseResults,
    assignments: assignmentResults,
    liveClasses: liveClassResults,
    topics: topicResults,
    totalCount,
  };
}
