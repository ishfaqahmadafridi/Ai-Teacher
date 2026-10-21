from calendar import day_name
from collections import deque
from datetime import time, timedelta
from uuid import uuid4

def minutes(value):
    parsed = time.fromisoformat(value)
    if parsed.second or parsed.microsecond or parsed.tzinfo:
        raise ValueError("Use a local time with whole minutes.")
    return parsed.hour * 60 + parsed.minute

def clock(value):
    return f"{value // 60:02d}:{value % 60:02d}"

def schedule_sessions(inputs, sessions):
    if inputs["preferences"].get("use_saved_plans"):
        from .saved_plan_timetable import format_saved_course_sessions
        return format_saved_course_sessions(inputs, sessions)
    preferences = inputs["preferences"]
    courses = {str(course["id"]): course for course in inputs["courses"]}
    start, end = minutes(preferences["start_time"]), minutes(preferences["end_time"])
    duration, gap = preferences["session_minutes"], preferences["break_minutes"]
    available = []
    time = start
    for _ in range(preferences["max_classes"]):
        if time + duration > end:
            break
        available.extend((day, time) for day in preferences["days"])
        time += duration + gap
    dated = bool(preferences.get('start_date'))
    if dated:
        from .study_plan_calendar import dated_slots, study_plan_dates
        available = dated_slots(preferences)
        plan_start, plan_end = study_plan_dates(preferences)
    # Interleave course queues while preserving each course's lesson order.
    queues = {course_id: deque() for course_id in courses}
    for session in sessions:
        course_id = str(session["course_id"])
        if course_id not in queues:
            raise ValueError("The learning plan references an unregistered course.")
        queues[course_id].append(session)
    ordered = []
    while any(queues.values()):
        for queue in queues.values():
            if queue:
                ordered.append(queue.popleft())
    if len(sessions) > len(available):
        raise ValueError("Your available hours cannot fit the learning plan. Increase study hours or reduce courses.")
    result = []
    if dated and len(ordered) > 1:
        available = [available[index * (len(available) - 1) // (len(ordered) - 1)] for index in range(len(ordered))]
    for session, (day, time) in zip(ordered, available):
        course = courses.get(str(session["course_id"]))
        if not course:
            raise ValueError("The learning plan references an unregistered course.")
        metadata = dict(sessionDate=day.isoformat(), weekNumber=(day-plan_start).days // 7 + 1, planStartDate=plan_start.isoformat(), planEndDate=(plan_end - timedelta(days=1)).isoformat(), sessionKind=session.get('sessionKind', 'lesson')) if dated else {}
        result.append(serialize_session(course, session, day, time, preferences, metadata))
    return dict(className="Your learning timetable", schedule=result, totalWeeklyClasses=len(result), optimizationSummary="Dated lessons and practice progress through your outline across the selected study period. Unused availability remains free study time." if dated else "Sessions scheduled within your saved availability.", timezone=preferences["timezone"])

def capacity(preferences):
    duration, gap = preferences["session_minutes"], preferences["break_minutes"]
    window = minutes(preferences["end_time"]) - minutes(preferences["start_time"])
    return len(preferences["days"]) * min(preferences["max_classes"], (window + gap) // (duration + gap))


def serialize_session(course, session, day, at, preferences, metadata):
    detail = next((item for item in course.get('outline_details', []) if item['title'] == session['title']), {})
    duration = preferences['session_minutes']
    return dict(**metadata, subtopics=session.get('subtopics', detail.get('subtopics', [])),
                exercises=session.get('exercises', detail.get('exercises', [])), id=str(uuid4()),
                courseId=str(course['id']), timezone=preferences['timezone'], title=session['title'],
                subject=course['title'], dayOfWeek=day_name[day.weekday()] if metadata else day,
                startTime=clock(at), endTime=clock(at + duration),
                timeFormatted=f'{clock(at)} - {clock(at + duration)}', timeSlot=f'{clock(at)} - {clock(at + duration)}',
                instructorName='AI Teacher', roomOrLink='', status='upcoming')
