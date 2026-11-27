"""Normalize unambiguous teaching labels without changing lesson content."""

CONCEPT_STAGES = ('example', 'practice')


def normalize_teaching_metadata(answer):
    """Infer only unambiguous stage labels; never invent narration or questions."""
    for chunk in answer['chunks']:
        if not chunk.get('teaching_step') and chunk.get('discussion_prompt'):
            chunk['teaching_step'] = 'discussion'
        elif not chunk.get('teaching_step') and chunk.get('question'):
            chunk['teaching_step'] = 'practice'
    if not answer.get('lesson_mode') and answer['chunks'][0].get('teaching_step') == 'introduction' and answer['chunks'][-1].get('teaching_step') == 'recap':
        answer['lesson_mode'] = 'lesson'
    if answer.get('lesson_mode') == 'lesson':
        repair_orphan_concept_ids(answer['chunks'])
        separate_adjacent_checks(answer['chunks'])
    return answer


def repair_orphan_concept_ids(chunks):
    """Attach an example/practice whose ID is never explained to the block it follows.

    Models often label stages as `<concept>_example`. When that ID has no explanation
    anywhere, the only consistent reading is the concept currently being taught.
    """
    explained = {c.get('concept_id') for c in chunks if c.get('teaching_step') == 'explanation'}
    current = None
    for chunk in chunks:
        step = chunk.get('teaching_step')
        if step == 'explanation':
            current = chunk.get('concept_id')
        elif step in CONCEPT_STAGES and current and chunk.get('concept_id') not in explained:
            chunk['concept_id'] = current
    return chunks


def is_check(chunk):
    return bool(chunk.get('question') or chunk.get('discussion_prompt'))


def is_safe_invitation_slot(chunks, index):
    """An invitation at `index` must follow teaching and sit between ordinary steps."""
    if index <= 0 or index >= len(chunks):
        return False
    taught = any(c.get('teaching_step') == 'explanation' for c in chunks[:index])
    return taught and not is_check(chunks[index - 1]) and not is_check(chunks[index])


def separate_adjacent_checks(chunks):
    """Move a Q&A invitation that touches a graded check to the nearest valid slot."""
    for index in range(len(chunks)):
        chunk = chunks[index]
        if not chunk.get('discussion_prompt'):
            continue
        neighbours = [chunks[i] for i in (index - 1, index + 1) if 0 <= i < len(chunks)]
        if not any(is_check(item) for item in neighbours):
            continue
        rest = chunks[:index] + chunks[index + 1:]
        slots = sorted(range(1, len(rest)), key=lambda slot: (abs(slot - index), slot > index))
        target = next((slot for slot in slots if is_safe_invitation_slot(rest, slot)), None)
        if target is not None:
            chunks[:] = rest[:target] + [chunk] + rest[target:]
    return chunks
