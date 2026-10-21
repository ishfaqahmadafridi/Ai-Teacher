'use client';
import { memo } from 'react';
import { groupCourseWeekTopics } from '../../utilities/courseOutlineWeekUtils';
import type { CourseOutlineWeeksProps } from '../../types/courses.types';

export const CourseOutlineWeeks = memo(function CourseOutlineWeeks({ weeks }: CourseOutlineWeeksProps) {
  return <section aria-label="Weekly course outline" className="space-y-3">
    <div><h3 className="text-base font-semibold">Your course in {weeks.length} weeks</h3><p className="mt-1 text-xs leading-5 text-dashboard-muted">Planned study work for this course, not a record of completed work. Review weeks reinforce earlier topics. Classroom dates and time slots are managed separately in Class Schedule.</p></div>
    <p className="text-xs text-dashboard-muted sm:hidden">Swipe sideways across the table to see all three columns.</p>
    <div className="overflow-x-auto rounded-xl border border-dashboard-border">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <caption className="sr-only">Course topics, included work and assigned weeks</caption>
        <thead className="bg-dashboard-subtle"><tr><th scope="col" className="w-1/4 p-4 font-semibold">Topic name</th><th scope="col" className="p-4 font-semibold">Subtopics and exercises</th><th scope="col" className="w-1/5 p-4 font-semibold">Week</th></tr></thead>
        {weeks.map(week => {
          const topics = groupCourseWeekTopics(week.items);
          return <tbody key={week.number}>{topics.map((item, index) => <tr key={`${week.number}-${index}`} className="border-t border-dashboard-border align-top">
          <th scope="row" className="break-words p-4 font-semibold">{item.title}<span className="mt-1 block text-xs font-normal text-dashboard-primary">{item.activities.join(' · ')}</span></th>
          <td className="space-y-3 p-4 text-dashboard-muted">
            {item.subtopics.length > 0 && <div><p className="mb-1 text-xs font-medium text-dashboard-text">Topics to cover</p><ul className="list-disc space-y-1 ps-5">{item.subtopics.map((topic, key) => <li key={key} className="break-words">{topic}</li>)}</ul></div>}
            {item.exercises.length > 0 && <div><p className="mb-1 text-xs font-medium text-dashboard-text">Exercises</p><ul className="list-disc space-y-1 ps-5">{item.exercises.map((exercise, key) => <li key={key} className="break-words">{exercise}{item.assignments.filter(assignment => assignment.exercise === exercise).map(assignment => <p key={assignment.exercise} className="mt-2 rounded-lg bg-dashboard-subtle p-3 text-xs"><strong className="text-dashboard-text">Assignment:</strong> {assignment.instruction}</p>)}</li>)}</ul></div>}
            {item.activities.includes('Review') && <p className="text-xs">Revisit this topic and practise explaining or applying what you learned.</p>}
            {item.activities.includes('Lesson') && !item.subtopics.length && <p className="text-xs">Study the main topic. No subtopics have been added.</p>}
          </td>
          {index === 0 && <td rowSpan={topics.length + (week.quiz ? 1 : 0)} className="border-l border-dashboard-border bg-dashboard-subtle/40 p-4"><span className="font-semibold">Week {week.number}</span></td>}
        </tr>)}{week.quiz && <tr className="border-t border-dashboard-border bg-dashboard-selected/30 align-top"><th scope="row" className="p-4 font-semibold text-dashboard-primary">{week.quiz.title}<span className="mt-1 block text-xs font-normal text-dashboard-muted">Planned assessment</span></th><td className="p-4 text-sm text-dashboard-muted"><p className="mb-2 text-xs font-medium text-dashboard-text">Quiz coverage</p><ul className="list-disc space-y-1 ps-5">{week.quiz.topics.map(topic => <li key={topic}>{topic}</li>)}</ul></td></tr>}</tbody>;
        })}
      </table>
    </div>
  </section>;
});
CourseOutlineWeeks.displayName = 'CourseOutlineWeeks';
