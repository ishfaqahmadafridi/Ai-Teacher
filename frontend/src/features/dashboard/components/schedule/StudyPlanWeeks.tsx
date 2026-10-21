'use client';
import { memo } from 'react';
import { groupStudyPlanWeeks } from '../../utilities/studyPlanUtils';
import { ScheduleItemCard } from './ScheduleItemCard';
import { TimetableSuggestionCard } from './TimetableSuggestionCard';
import type { StudyPlanWeeksProps } from '../../types/studyPlan.types';

export const StudyPlanWeeks = memo(function StudyPlanWeeks({ items, onJoinClass, onSelectNoticeItem }: StudyPlanWeeksProps) {
  const weeks = groupStudyPlanWeeks(items);
  const first = items.find(item => item.planStartDate);
  return <section className="space-y-3" aria-label="Dated class timetable">
    <div><h2 className="text-lg font-semibold">Your class timetable</h2><p className="mt-1 text-xs text-dashboard-muted">{weeks[0]?.start} – {weeks.at(-1)?.end} · {items.filter(item => item.planStartDate).length} dated classes · {first?.timezone}. Practice is planned; attendance does not certify exercise completion.</p></div>
    {weeks.map((week, index) => <details key={week.number} open={index === 0} className="rounded-xl border border-dashboard-border bg-dashboard-panel">
      <summary className="cursor-pointer p-4 text-sm font-semibold">Week {week.number} · {week.start} – {week.end}<span className="ms-3 text-xs font-normal text-dashboard-muted">{week.items.length} classes · {week.items.filter(item => item.attendance === 'attended').length} attended</span></summary>
      <div className="space-y-4 border-t border-dashboard-border p-4">
        <div><h3 className="text-sm font-semibold">This week’s goals</h3>{week.goals.length ? <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-dashboard-muted">{week.goals.map(goal => <li key={goal}>{goal}</li>)}</ul> : <p className="mt-2 text-sm text-dashboard-muted">No classes scheduled this week.</p>}</div>
        {week.items.map(item => <article key={item.id} className="space-y-2">
          <p className="text-xs font-medium text-dashboard-primary">{item.dayOfWeek}, {item.sessionDate} · {item.startTime}–{item.endTime} · {item.sessionKind === 'quiz' ? 'Quiz' : item.sessionKind === 'practice' ? 'Practice' : 'Lesson'}</p>
          {onJoinClass ? <ScheduleItemCard item={item} onJoinClass={onJoinClass} onSelectNoticeItem={onSelectNoticeItem} /> : <TimetableSuggestionCard item={item} />}
          {!!item.subtopics?.length && <div className="text-xs leading-5 text-dashboard-muted"><strong>Includes</strong><ul className="list-disc ps-5">{item.subtopics.map((text, key) => <li key={key}>{text}</li>)}</ul></div>}
          {!!item.exercises?.length && <div className="text-xs leading-5 text-dashboard-muted"><strong>Exercises to practise</strong><ul className="list-disc ps-5">{item.exercises.map((text, key) => <li key={key}>{text}</li>)}</ul></div>}
        </article>)}
      </div>
    </details>)}
    {!!items.filter(item => !item.planStartDate).length && <section className="space-y-3"><h3 className="font-semibold">Additional weekly classes</h3>{items.filter(item => !item.planStartDate).map(item => <ScheduleItemCard key={item.id} item={item} onJoinClass={onJoinClass} onSelectNoticeItem={onSelectNoticeItem} />)}</section>}
  </section>;
});
StudyPlanWeeks.displayName = 'StudyPlanWeeks';
