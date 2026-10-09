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

  const topicResults: SearchResultItem[] = [];

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
