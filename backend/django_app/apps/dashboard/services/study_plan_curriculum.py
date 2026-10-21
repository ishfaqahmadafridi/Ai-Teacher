"""Convert saved outlines into finite learning and practice sessions, without AI repetition."""
from collections import deque
from .study_plan_calendar import dated_slots


def plan_dated_sessions(inputs):
    slots = dated_slots(inputs['preferences'])
    compact, detailed = {}, {}
    for course in inputs['courses']:
        topics = course.get('outline_topics', [])
        if not topics:
            raise ValueError(f"Save a course outline for {course['title']} before planning dated classes.")
        lookup = {item['title']: item for item in course.get('outline_details', [])}
        compact[str(course['id'])], detailed[str(course['id'])] = [], []
        for title in topics:
            detail = lookup.get(title, {})
            subtopics, exercises = detail.get('subtopics', []), detail.get('exercises', [])
            base = dict(course_id=str(course['id']), title=title)
            compact[str(course['id'])].append(dict(**base, sessionKind='lesson', subtopics=subtopics, exercises=[]))
            detailed[str(course['id'])].extend(dict(**base, sessionKind='lesson', subtopics=[part], exercises=[]) for part in subtopics)
            if not subtopics:
                detailed[str(course['id'])].append(dict(**base, sessionKind='lesson', subtopics=[], exercises=[]))
            if exercises:
                compact[str(course['id'])].append(dict(**base, sessionKind='practice', subtopics=subtopics, exercises=exercises))
                detailed[str(course['id'])].extend(dict(**base, sessionKind='practice', subtopics=subtopics, exercises=[exercise]) for exercise in exercises)
    if sum(map(len, compact.values())) > len(slots):
        raise ValueError('Your available time cannot cover every topic and its practice. Increase the duration or study availability, or shorten the outline.')
    chosen = detailed if sum(map(len, detailed.values())) <= len(slots) else compact
    queues = {key: deque(value) for key, value in chosen.items()}
    result = []
    while any(queues.values()):
        for queue in queues.values():
            if queue:
                result.append(queue.popleft())
    return result
