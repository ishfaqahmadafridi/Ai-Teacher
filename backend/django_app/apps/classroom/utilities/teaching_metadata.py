"""Normalize unambiguous teaching labels without changing lesson content."""


def normalize_teaching_metadata(answer):
    """Infer only unambiguous stage labels; never invent narration or questions."""
    for chunk in answer['chunks']:
        if not chunk.get('teaching_step') and chunk.get('discussion_prompt'):
            chunk['teaching_step'] = 'discussion'
        elif not chunk.get('teaching_step') and chunk.get('question'):
            chunk['teaching_step'] = 'practice'
    if not answer.get('lesson_mode') and answer['chunks'][0].get('teaching_step') == 'introduction' and answer['chunks'][-1].get('teaching_step') == 'recap':
        answer['lesson_mode'] = 'lesson'
    return answer
