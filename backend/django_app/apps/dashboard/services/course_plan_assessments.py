"""Planned coursework and quiz checkpoints; these are not graded submissions."""
from ..constants.study_plan import COURSE_PLAN_QUIZ_COUNT


def add_course_assessments(weeks):
    checkpoints = {max(1, index * len(weeks) // COURSE_PLAN_QUIZ_COUNT): index
                   for index in range(1, COURSE_PLAN_QUIZ_COUNT + 1)}
    scope, cumulative = [], []
    for week in weeks:
        for item in week['items']:
            # Review repeats earlier work; do not issue the same assignment again.
            item['assignments'] = [dict(exercise=exercise, instruction=f'Submit your solution and explain your approach: {exercise}')
                                   for exercise in item['exercises']] if item['activity'] == 'Practice' else []
            if item['title'] not in scope:
                scope.append(item['title'])
            if item['title'] not in cumulative:
                cumulative.append(item['title'])
        number = checkpoints.get(week['number'])
        week['quiz'] = dict(number=number, title=f'Quiz {number}', topics=list(cumulative if number == COURSE_PLAN_QUIZ_COUNT else scope)) if number else None
        if number:
            scope = []
    return weeks
