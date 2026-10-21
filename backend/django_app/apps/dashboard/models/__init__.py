"""
apps/dashboard/models/__init__.py
"""
from .course import CourseModel
from .assignment import AssignmentModel
from .live_class import LiveClassModel

__all__ = [
    "CourseModel",
    "AssignmentModel",
    "LiveClassModel",
    "TimetableJob",
    "SavedTimetable",
    "SessionAttendance",
    "SessionOccurrence",
]

from .timetable_models import TimetableJob, SavedTimetable
from .timetable_models import SessionAttendance

from .timetable_models import SessionOccurrence
