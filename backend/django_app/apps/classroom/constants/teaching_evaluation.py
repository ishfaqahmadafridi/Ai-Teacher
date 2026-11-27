"""
apps/classroom/constants/teaching_evaluation.py

Fixed evaluation set: the same topics are run after every prompt, model or profile change so
quality, size, cost and speed are compared on equal terms instead of guessed.
"""
# (topic request, course label or '' for an ad-hoc question, expected subject ID)
TEACHING_EVALUATION_SET = (
    ('explain the mid brain', 'MBBS Neuroanatomy', 'medicine'),
    ('Nature of roots of a quadratic equation', 'FSc Mathematics', 'mathematics'),
    ('Projectile motion', 'FSc Physics', 'physics'),
    ('SN2 reaction mechanism', 'Organic Chemistry', 'chemistry'),
    ('Binary search', 'BSCS Data Structures', 'computer_science'),
    ('How a four-stroke engine works', 'Mechanical Engineering', 'engineering'),
    ('Photosynthesis', 'FSc Biology', 'biology'),
)
WORDS_PER_SPOKEN_MINUTE = 140
