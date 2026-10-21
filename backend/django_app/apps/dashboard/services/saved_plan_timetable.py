"""Place saved weekly course work into available class times without replanning it."""
from datetime import date, timedelta
from django.utils import timezone
from zoneinfo import ZoneInfo
from .course_outline_plan import build_course_weeks
from .study_plan_calendar import dated_slots, study_plan_dates


def plan_saved_course_sessions(inputs):
    preferences, tasks = inputs['preferences'], []
    today = timezone.now().astimezone(ZoneInfo(preferences['timezone'])).date()
    for course in inputs['courses']:
        period = course.get('outline_period')
        if not course.get('outline_topics') or not period:
            raise ValueError(f"Save a study plan for {course['title']} before creating its class timetable.")
        if study_plan_dates(period)[1] <= today:
            raise ValueError(f"The saved plan for {course['title']} has ended. Update its course plan dates before scheduling classes.")
        slots = dated_slots({**preferences, **period})
        weeks = build_course_weeks(course['outline_topics'], course.get('outline_details', []), period)
        for week in weeks:
            if date.fromisoformat(week['end']) < today:
                continue
            grouped = {}
            for item in week['items']:
                scope = grouped.setdefault(item['title'], dict(course_id=str(course['id']), title=item['title'], subtopics=[], exercises=[], sessionKind='lesson'))
                for field in ('subtopics', 'exercises'):
                    scope[field] = list(dict.fromkeys(scope[field] + item[field]))
            units = list(grouped.values())
            if week['quiz']:
                units.append(dict(course_id=str(course['id']), title=f"{week['quiz']['title']}: {course['title']}",
                                  subtopics=week['quiz']['topics'], exercises=[], sessionKind='quiz'))
            candidates = [slot for slot in slots if week['start'] <= slot[0].isoformat() <= week['end']]
            for unit in units:
                tasks.append((week['end'], week['number'], course, unit, candidates))
    used, daily, result = set(), {}, []
    for _, week, course, unit, candidates in sorted(tasks, key=lambda item: item[0]):
        chosen = next((slot for slot in candidates if slot not in used and daily.get(slot[0], 0) < preferences['max_classes']), None)
        if chosen is None:
            raise ValueError(f"Week {week} of {course['title']} cannot fit your class availability. Choose more class days, increase daily capacity or select fewer courses. The saved study plan is unchanged.")
        used.add(chosen)
        daily[chosen[0]] = daily.get(chosen[0], 0) + 1
        result.append({**unit, 'sessionDate': chosen[0].isoformat(), 'minute': chosen[1], 'weekNumber': week})
    if not result:
        raise ValueError('These saved plans have ended. Update the course plan dates before scheduling classes.')
    return sorted(result, key=lambda item: (item['sessionDate'], item['minute']))


def format_saved_course_sessions(inputs, sessions):
    from .timetable_scheduler import serialize_session
    courses = {str(course['id']): course for course in inputs['courses']}
    result = []
    for session in sessions:
        course = courses[session['course_id']]
        start, end = study_plan_dates(course['outline_period'])
        metadata = dict(sessionDate=session['sessionDate'], weekNumber=session['weekNumber'],
                        planStartDate=start.isoformat(), planEndDate=(end - timedelta(days=1)).isoformat(), sessionKind=session['sessionKind'])
        result.append(serialize_session(course, session, date.fromisoformat(session['sessionDate']), session['minute'], inputs['preferences'], metadata))
    return dict(className='Your class timetable', schedule=result, totalWeeklyClasses=len(result),
                optimizationSummary='Class times follow the selected courses’ saved weekly plans. Only upcoming classes are scheduled; study plans are unchanged.', timezone=inputs['preferences']['timezone'])
