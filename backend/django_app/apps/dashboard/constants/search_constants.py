"""
apps/dashboard/constants/search_constants.py

Default static search fallback data and search configuration limits for the Dashboard app.
"""

DEFAULT_SEARCH_COURSES = [
    {
        "id": "rc1",
        "type": "course",
        "title": "Introduction to Computer Science & Software Engineering",
        "subtitle": "CS-101 • Computer Science (75% Complete)",
        "badgeText": "Course",
        "actionPayload": {"targetTab": "dashboard", "courseId": "rc1"},
        "subjectField": "Computer Science (CS)",
        "courseCode": "CS-101",
    },
    {
        "id": "rc2",
        "type": "course",
        "title": "Data Structures, Algorithms & Problem Solving",
        "subtitle": "CS-201 • Computer Science (60% Complete)",
        "badgeText": "Course",
        "actionPayload": {"targetTab": "dashboard", "courseId": "rc2"},
        "subjectField": "Computer Science (CS)",
        "courseCode": "CS-201",
    },
    {
        "id": "rc3",
        "type": "course",
        "title": "Database Management Systems & SQL Architecture",
        "subtitle": "IT-305 • Information Technology (40% Complete)",
        "badgeText": "Course",
        "actionPayload": {"targetTab": "dashboard", "courseId": "rc3"},
        "subjectField": "Information Technology (IT)",
        "courseCode": "IT-305",
    },
    {
        "id": "rc4",
        "type": "course",
        "title": "Artificial Intelligence & Neural Network Models",
        "subtitle": "AI-402 • Artificial Intelligence (68% Complete)",
        "badgeText": "Course",
        "actionPayload": {"targetTab": "dashboard", "courseId": "rc4"},
        "subjectField": "Artificial Intelligence (AI)",
        "courseCode": "AI-402",
    },
]

DEFAULT_SEARCH_ASSIGNMENTS = [
    {
        "id": "a1",
        "type": "assignment",
        "title": "Data Structures & Algorithm Analysis Lab",
        "subtitle": "Computer Science • Due in 2 days (100 pts)",
        "badgeText": "Assignment",
        "actionPayload": {"targetTab": "assignments_quizzes", "taskId": "a1"},
        "subject": "Computer Science (CS)",
    },
    {
        "id": "a2",
        "type": "assignment",
        "title": "AI Neural Networks & Transformer Architectures Quiz",
        "subtitle": "Artificial Intelligence • Due Jan 28 (50 pts)",
        "badgeText": "Quiz",
        "actionPayload": {"targetTab": "assignments_quizzes", "taskId": "a2"},
        "subject": "Artificial Intelligence (AI)",
    },
    {
        "id": "a3",
        "type": "assignment",
        "title": "SQL Database System Architecture & Practice Set",
        "subtitle": "Information Technology • Completed Jan 20 (100 pts)",
        "badgeText": "Assignment",
        "actionPayload": {"targetTab": "assignments_quizzes", "taskId": "a3"},
        "subject": "Information Technology (IT)",
    },
]

DEFAULT_SEARCH_LIVE_CLASSES = [
    {
        "id": "lc1",
        "type": "live_class",
        "title": "Data Structures & Algorithms Masterclass",
        "subtitle": "Computer Science • Dr. Aris Thorne (Today at 2:00 PM)",
        "badgeText": "LIVE NOW",
        "actionPayload": {"targetTab": "schedule", "classId": "lc1"},
        "subject": "Computer Science (CS)",
        "instructor": "Dr. Aris Thorne",
    },
    {
        "id": "lc2",
        "type": "live_class",
        "title": "Artificial Intelligence & Neural Networks",
        "subtitle": "Artificial Intelligence • Prof. Elena Rostova (Tomorrow at 10:00 AM)",
        "badgeText": "Live Class",
        "actionPayload": {"targetTab": "schedule", "classId": "lc2"},
        "subject": "Artificial Intelligence (AI)",
        "instructor": "Prof. Elena Rostova",
    },
]

DEFAULT_SEARCH_TOPICS = [
    {
        "id": "t1",
        "type": "topic",
        "title": "Neural Networks & Deep Learning",
        "subtitle": "AI-MOD-01 • Artificial Intelligence",
        "badgeText": "Topic",
        "actionPayload": {"targetTab": "dashboard"},
        "subject": "Artificial Intelligence",
    },
    {
        "id": "t2",
        "type": "topic",
        "title": "Data Structures: Hash Tables & Trees",
        "subtitle": "CS-MOD-04 • Computer Science",
        "badgeText": "Topic",
        "actionPayload": {"targetTab": "dashboard"},
        "subject": "Computer Science",
    },
]

SEARCH_CACHE_TTL_SECONDS = 300
