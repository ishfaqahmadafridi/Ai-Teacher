"""Validate connected concept structure and scheduled teaching modes."""


class TeachingQualityError(ValueError):
    """A new answer is not suitable for publication as a completed teaching response."""


def validate_teaching_structure(answer, curriculum=None, require_full_coverage=False):
    mode = answer.get('lesson_mode')
    if not mode:
        raise TeachingQualityError('Declare the appropriate lesson_mode and teaching steps.')
    quiz = curriculum and curriculum.get('session_kind') == 'quiz'
    if quiz and mode != 'quiz':
        raise TeachingQualityError('The saved quiz must remain an assessment, not a teaching lesson.')
    if require_full_coverage and not quiz and mode != 'lesson':
        raise TeachingQualityError('A complete scheduled lesson cannot be replaced by a focused reply.')
    chunks = answer['chunks']
    invitations = [index for index, chunk in enumerate(chunks) if chunk.get('discussion_prompt')]
    for index in invitations:
        if chunks[index]['speak'].strip() != chunks[index]['discussion_prompt'].strip():
            raise TeachingQualityError('Speak the exact standalone concept question invitation.')
    if mode in ('quiz', 'clarification'):
        if invitations or (mode == 'clarification' and any(c.get('question') for c in chunks)):
            raise TeachingQualityError('Quiz/clarification responses must not open concept Q&A.')
        if mode == 'quiz' and (not any(c.get('question') for c in chunks) or any(c.get('teaching_step') == 'example' for c in chunks)):
            raise TeachingQualityError('A quiz requires assessment questions and must not reveal worked solutions.')
        return
    if mode != 'lesson':
        return
    if chunks[0].get('teaching_step') != 'introduction' or chunks[-1].get('teaching_step') != 'recap':
        raise TeachingQualityError('Start with a learning goal and finish with a connected recap.')
    if not invitations:
        raise TeachingQualityError('Include a standalone discussion_prompt after teaching a concept block.')
    if not any(c.get('question') and c.get('teaching_step') == 'practice' for c in chunks):
        raise TeachingQualityError('Include a graded practice question with assessment criteria.')
    concepts = {}
    current = None
    closed = set()
    for index, chunk in enumerate(chunks):
        step = chunk.get('teaching_step')
        if not step:
            raise TeachingQualityError('Every lesson chunk needs one teaching_step.')
        if chunk.get('discussion_prompt') and step != 'discussion':
            raise TeachingQualityError('A question invitation must use the discussion teaching_step.')
        if step == 'discussion' and not chunk.get('discussion_prompt'):
            raise TeachingQualityError('A discussion step must include its discussion_prompt.')
        if step in ('explanation', 'example', 'practice'):
            concept = chunk.get('concept_id')
            if not concept:
                raise TeachingQualityError('Give every explanation/example/practice a stable concept_id.')
            if concept != current:
                if current is not None:
                    closed.add(current)
                if concept in closed:
                    raise TeachingQualityError('Finish each concept block before moving to the next concept.')
                current = concept
            steps = concepts.setdefault(concept, set())
            if step != 'explanation' and 'explanation' not in steps:
                raise TeachingQualityError('Explain a concept before its example or practice. Reuse the exact explanation concept_id for the example and practice; do not give teaching stages new IDs.')
            steps.add(step)
    incomplete = [name for name, steps in concepts.items() if not {'explanation', 'example'} <= steps]
    if not concepts or incomplete:
        raise TeachingQualityError('Each concept needs substantive explanation and an example/application. Missing stages for concept IDs: ' + ', '.join(incomplete))
    for index in invitations:
        if index == 0 or index == len(chunks) - 1 or not any(c.get('teaching_step') == 'explanation' for c in chunks[:index]):
            raise TeachingQualityError('Place Q&A after concept teaching and before lesson completion.')
        if any(chunks[adjacent].get('question') or chunks[adjacent].get('discussion_prompt')
               for adjacent in (index - 1, index + 1)):
            raise TeachingQualityError('Separate Q&A invitations and graded checks with a teaching step.')
