from collections import deque
from datetime import time
from uuid import uuid4

def minutes(value):
    parsed = time.fromisoformat(value)
    if parsed.second or parsed.microsecond or parsed.tzinfo:
        raise ValueError("Use a local time with whole minutes.")
    return parsed.hour * 60 + parsed.minute

def clock(value):
    return f"{value // 60:02d}:{value % 60:02d}"

def schedule_sessions(inputs, sessions):
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
    for session, (day, time) in zip(ordered, available):
        course = courses.get(str(session["course_id"]))
        if not course:
            raise ValueError("The learning plan references an unregistered course.")
        result.append(dict(id=str(uuid4()), courseId=str(course["id"]), timezone=preferences["timezone"], title=session["title"], subject=course["title"], dayOfWeek=day, startTime=clock(time), endTime=clock(time+duration), timeFormatted=f"{clock(time)} - {clock(time+duration)}", timeSlot=f"{clock(time)} - {clock(time+duration)}", instructorName="AI Teacher", roomOrLink="", status="upcoming"))
    return dict(className="Your learning timetable", schedule=result, totalWeeklyClasses=len(result), optimizationSummary="Sessions scheduled within your saved availability.", timezone=preferences["timezone"])

def capacity(preferences):
    duration, gap = preferences["session_minutes"], preferences["break_minutes"]
    window = minutes(preferences["end_time"]) - minutes(preferences["start_time"])
    return len(preferences["days"]) * min(preferences["max_classes"], (window + gap) // (duration + gap))
