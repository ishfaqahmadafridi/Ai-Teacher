"""
apps/classroom/constants/subjects.py

Subject taxonomy: stable IDs, display labels, course-name aliases and topic hints.

WHY STABLE IDS:
    Course names are free text ("Maths", "FSc Mathematics", "Bio"). Teaching rules are chosen by
    ID, so different institutions' names reach the same rules. Version the registry so a saved
    lecture can record which subject rules taught it.
"""
from .visuals import ANATOMY_KEYWORDS

SUBJECT_REGISTRY_VERSION = '1'
GENERAL_SUBJECT = 'general'
MAX_LESSON_SUBJECTS = 2

# Course label words/phrases → subject. Order matters: the first subject whose alias appears wins,
# so specific fields (medicine, engineering) are listed before broad ones (biology, physics).
SUBJECTS = {
    'medicine': {'label': 'Medicine', 'aliases': (
        'medicine', 'medical', 'mbbs', 'bds', 'anatomy', 'neuroanatomy', 'physiology', 'pathology',
        'pharmacology', 'histology', 'clinical')},
    'computer_science': {'label': 'Computer science', 'aliases': (
        'computer science', 'computer', 'computing', 'cs', 'ics', 'bscs', 'programming', 'software',
        'data structures', 'algorithms', 'artificial intelligence', 'database')},
    'engineering': {'label': 'Engineering', 'aliases': (
        'engineering', 'mechanical', 'electrical', 'electronics', 'civil', 'mechatronics')},
    'mathematics': {'label': 'Mathematics', 'aliases': (
        'mathematics', 'maths', 'math', 'algebra', 'calculus', 'geometry', 'trigonometry', 'statistics')},
    'chemistry': {'label': 'Chemistry', 'aliases': ('chemistry', 'organic chemistry', 'biochemistry')},
    'physics': {'label': 'Physics', 'aliases': ('physics', 'mechanics', 'thermodynamics', 'electromagnetism')},
    'biology': {'label': 'Biology', 'aliases': (
        'biology', 'bio', 'life sciences', 'zoology', 'botany', 'genetics', 'ecology', 'microbiology')},
}

# Topic words used only when there is no course label (ad-hoc questions).
SUBJECT_TOPIC_HINTS = {
    'medicine': tuple(word for words in ANATOMY_KEYWORDS.values() for word in words) + (
        'disease', 'symptom', 'diagnosis', 'clinical', 'nerve', 'neuron', 'artery', 'vein'),
    'computer_science': ('algorithm', 'code', 'python', 'javascript', 'sql', 'array', 'linked list',
                         'recursion', 'binary search', 'sorting', 'compiler', 'database'),
    'engineering': ('beam', 'bridge', 'piston', 'engine', 'gear', 'pulley', 'stress', 'strain',
                    'circuit', 'resistor', 'capacitor', 'transistor'),
    'mathematics': ('equation', 'quadratic', 'polynomial', 'derivative', 'integral', 'matrix',
                    'theorem', 'proof', 'discriminant', 'logarithm', 'probability'),
    'chemistry': ('molecule', 'atom', 'reaction', 'bond', 'acid', 'base', 'mole', 'electron configuration',
                  'periodic table', 'oxidation', 'sn2', 'stoichiometry'),
    'physics': ('force', 'velocity', 'acceleration', 'gravity', 'momentum', 'energy', 'newton',
                'projectile', 'wave', 'friction', 'electric field', 'ohm'),
    'biology': ('cell', 'dna', 'photosynthesis', 'mitosis', 'meiosis', 'enzyme', 'ecosystem',
                'evolution', 'plant', 'organism'),
}
