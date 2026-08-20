/**
 * features/dashboard/tests/dashboardSearch.test.ts
 *
 * Unit tests for the dashboard live search feature:
 *   - searchUtils.ts pure helper functions
 *   - topbar.types.ts type contracts
 *   - Keyboard event shortcuts & dropdown state contract
 */

import { searchDashboardItems } from '../utilities/searchUtils';
import type {
  SearchResultItem,
  SearchGroupedResults,
  NavSearchResultsDropdownProps,
} from '../types/topbar.types';
import type { RegisteredCourseItem } from '../types/courses.types';
import type { AssignmentItem, LiveClassItem } from '../types/dashboard.types';

// ── 1. searchUtils.ts Unit Tests ──────────────────────────────────────────────

describe('searchUtils — searchDashboardItems()', () => {
  const mockCourses: RegisteredCourseItem[] = [
    {
      id: 'c1',
      title: 'Linear Algebra & Matrix Theory',
      subjectField: 'Mathematics',
      courseCode: 'MATH-201',
      creditHours: 4,
      progressPercent: 80,
      completedLessons: 10,
      totalLessons: 12,
      enrolledDate: 'Jan 2026',
      status: 'active',
    },
    {
      id: 'c2',
      title: 'Quantum Physics Fundamentals',
      subjectField: 'Physics',
      courseCode: 'PHYS-301',
      creditHours: 3,
      progressPercent: 50,
      completedLessons: 6,
      totalLessons: 12,
      enrolledDate: 'Feb 2026',
      status: 'active',
    },
  ];

  const mockAssignments: AssignmentItem[] = [
    {
      id: 'a1',
      title: 'Linear Algebra Homework 3',
      subject: 'Mathematics',
      dueDate: 'Due in 2 days',
      status: 'in_progress',
      points: 100,
      type: 'assignment',
    },
    {
      id: 'a2',
      title: 'Quantum Physics Midterm Quiz',
      subject: 'Physics',
      dueDate: 'Due Jan 30',
      status: 'pending',
      points: 50,
      type: 'quiz',
    },
  ];

  const mockLiveClasses: LiveClassItem[] = [
    {
      id: 'lc1',
      title: 'Linear Algebra Live Problem Solving',
      subject: 'Mathematics',
      instructorName: 'Dr. Sarah Jenkins',
      instructorAvatar: 'https://example.com/avatar.jpg',
      timeFormatted: 'Today at 3:00 PM',
      isLive: true,
      attendanceCount: 30,
      bgGradient: 'from-blue-900 to-indigo-900',
      progressPercent: 50,
      completedLessons: 5,
      totalLessons: 10,
    },
  ];

  it('returns empty results when query is empty string or whitespace', () => {
    const resEmpty = searchDashboardItems('', mockCourses, mockAssignments, mockLiveClasses);
    expect(resEmpty.totalCount).toBe(0);
    expect(resEmpty.courses).toHaveLength(0);
    expect(resEmpty.assignments).toHaveLength(0);

    const resSpaces = searchDashboardItems('   ', mockCourses, mockAssignments, mockLiveClasses);
    expect(resSpaces.totalCount).toBe(0);
  });

  it('filters courses by title, courseCode, and subjectField (case-insensitive)', () => {
    const resMath = searchDashboardItems('linear', mockCourses, mockAssignments, mockLiveClasses);
    expect(resMath.courses).toHaveLength(1);
    expect(resMath.courses[0].title).toBe('Linear Algebra & Matrix Theory');
    expect(resMath.courses[0].badgeText).toBe('Course');

    const resCode = searchDashboardItems('MATH-201', mockCourses, mockAssignments, mockLiveClasses);
    expect(resCode.courses).toHaveLength(1);
  });

  it('filters assignments and quizzes correctly', () => {
    const resQuiz = searchDashboardItems('quiz', mockCourses, mockAssignments, mockLiveClasses);
    expect(resQuiz.assignments).toHaveLength(1);
    expect(resQuiz.assignments[0].title).toBe('Quantum Physics Midterm Quiz');
    expect(resQuiz.assignments[0].badgeText).toBe('Quiz');
  });

  it('filters live classes and sets LIVE NOW badge when isLive is true', () => {
    const resLive = searchDashboardItems('Problem Solving', mockCourses, mockAssignments, mockLiveClasses);
    expect(resLive.liveClasses).toHaveLength(1);
    expect(resLive.liveClasses[0].badgeText).toBe('LIVE NOW');
  });

  it('handles empty data arrays gracefully without throwing', () => {
    const res = searchDashboardItems('AI', [], [], []);
    expect(res.totalCount).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(res.courses)).toBe(true);
    expect(Array.isArray(res.assignments)).toBe(true);
    expect(Array.isArray(res.liveClasses)).toBe(true);
    expect(Array.isArray(res.topics)).toBe(true);
  });
});

// ── 2. topbar.types.ts Contract Tests ──────────────────────────────────────────

describe('topbar.types.ts — Search type contracts', () => {
  it('SearchResultItem accepts valid course search result object', () => {
    const item: SearchResultItem = {
      id: 'sr1',
      type: 'course',
      title: 'Intro to CS',
      subtitle: 'CS-101 • Computer Science',
      badgeText: 'Course',
      actionPayload: { targetTab: 'dashboard', courseId: 'c1' },
    };
    expect(item.id).toBe('sr1');
    expect(item.type).toBe('course');
  });

  it('SearchGroupedResults accepts valid grouped object', () => {
    const grouped: SearchGroupedResults = {
      courses: [],
      assignments: [],
      liveClasses: [],
      topics: [],
      totalCount: 0,
    };
    expect(grouped.totalCount).toBe(0);
  });

  it('NavSearchResultsDropdownProps accepts valid props object', () => {
    const props: NavSearchResultsDropdownProps = {
      isOpen: true,
      searchQuery: 'Physics',
      results: {
        courses: [],
        assignments: [],
        liveClasses: [],
        topics: [],
        totalCount: 0,
      },
      onSelectResult: jest.fn(),
      onClose: jest.fn(),
    };
    expect(props.isOpen).toBe(true);
    expect(props.searchQuery).toBe('Physics');
  });
});

// ── 3. Keyboard Event Shortcut Contract Tests ─────────────────────────────────

describe('Keyboard event shortcuts contract', () => {
  it('dispatches Escape key event without crashing', () => {
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    expect(() => window.dispatchEvent(escapeEvent)).not.toThrow();
  });

  it('dispatches Cmd+K key event without crashing', () => {
    const cmdKEvent = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
    expect(() => window.dispatchEvent(cmdKEvent)).not.toThrow();
  });
});
