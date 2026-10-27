"""Validate explicit curriculum-to-explanation links before a lesson is published."""


class CurriculumCoverageError(ValueError):
    pass


def validate_curriculum_coverage(answer, curriculum):
    required = {item['id']: item for item in curriculum['requirements']}
    covered = set()
    for chunk in answer['chunks']:
        identifiers = chunk.get('curriculum_ids', [])
        if set(identifiers) - required.keys():
            raise CurriculumCoverageError('The lesson refers to unknown curriculum items.')
        narration = chunk['speak'].strip()
        evidence = ' '.join((chunk.get('key_point', '') + ' ' + narration).casefold().split())
        for identifier in identifiers:
            label = ' '.join(required[identifier]['label'].casefold().split())
            if label in evidence and narration.casefold() != label:
                covered.add(identifier)
    if required.keys() - covered:
        raise CurriculumCoverageError('The lesson did not address every required curriculum item.')
    return list(required)


def review_curriculum_coverage(llm, answer, curriculum, student_context):
    import json
    from apps.classroom.services.llm_service import extract_json
    from apps.classroom.serializers.curriculum_review_serializers import CurriculumReviewSerializer
    from apps.classroom.prompts.curriculum_review_prompt import CURRICULUM_REVIEW_PROMPT
    required = validate_curriculum_coverage(answer, curriculum)
    response = llm.invoke([
        ('system', CURRICULUM_REVIEW_PROMPT),
        ('human', json.dumps(dict(curriculum=curriculum, student_context=student_context,
                                  narration=[dict(speak=chunk['speak'], key_point=chunk.get('key_point', '')) for chunk in answer['chunks']]))),
    ])
    serializer = CurriculumReviewSerializer(data=extract_json(response.text))
    serializer.is_valid(raise_exception=True)
    report = serializer.validated_data
    findings = report['findings']
    identifiers = [item['requirement_id'] for item in findings]
    if not report['level_appropriate'] or len(identifiers) != len(required) or set(identifiers) != set(required):
        raise CurriculumCoverageError('The lesson failed its independent curriculum or student-level review.')
    for finding in findings:
        quote = finding['evidence'].strip()
        if not finding['covered'] or not quote or quote.casefold() == next(item['label'].casefold() for item in curriculum['requirements'] if item['id'] == finding['requirement_id']) or not any(quote in chunk['speak'] for chunk in answer['chunks']):
            raise CurriculumCoverageError('The review did not provide supporting narration for every curriculum item.')
    return required, (response.usage_metadata or {}).get('total_tokens', 0)
