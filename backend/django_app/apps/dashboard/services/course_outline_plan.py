"""Distribute an ordered course curriculum over its selected calendar period."""
from datetime import timedelta
from .course_plan_assessments import add_course_assessments
from .study_plan_calendar import study_plan_dates


def build_course_weeks(topics, details, period):
    if not period or not topics:
        return []
    start, end = study_plan_dates(period)
    count = ((end - start).days + 6) // 7
    lookup = {item['title']: item for item in details}
    units = []
    for title in topics:
        detail = lookup.get(title, {})
        subtopics = detail.get('subtopics', [])
        units.extend(dict(title=title, subtopics=[part] if part else [], exercises=[], activity='Lesson')
                     for part in (subtopics or [None]))
        units.extend(dict(title=title, subtopics=[], exercises=[exercise], activity='Practice')
                     for exercise in detail.get('exercises', []))
    buckets = [[] for _ in range(count)]
    for index, unit in enumerate(units):
        buckets[min(count - 1, index * count // len(units))].append(unit)
    weeks, previous, covered = [], None, {}
    for index, items in enumerate(buckets):
        if items:
            for item in items:
                entry = covered.setdefault(item['title'], dict(subtopics=[], exercises=[]))
                entry['subtopics'].extend(item['subtopics'])
                entry['exercises'].extend(item['exercises'])
            previous = items[-1]['title']
        else:
            detail = covered.get(previous, {})
            items = [dict(title=previous, subtopics=list(detail.get('subtopics', [])),
                          exercises=list(detail.get('exercises', [])), activity='Review')]
        first = start + timedelta(days=index * 7)
        weeks.append(dict(number=index + 1, start=first.isoformat(),
                          end=min(first + timedelta(days=6), end - timedelta(days=1)).isoformat(), items=items))
    return add_course_assessments(weeks)
