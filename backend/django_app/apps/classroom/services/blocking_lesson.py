"""Legacy blocking lesson orchestration; the view only handles HTTP concerns."""
from apps.classroom.inference import generate_answer
from apps.classroom.serializers import AskResponseSerializer
from apps.classroom.services.lecture_notes import account_session_id, save_lecture_note
from apps.classroom.services.student_teaching_context import student_teaching_context
from apps.classroom.utilities.serializer_data import validated_mapping


def prepare_blocking_lesson(user, request_data):
    inputs = {
        **request_data,
        'session_id': account_session_id(user, request_data['session_id']),
    }
    if user.is_authenticated:
        inputs['student_context'] = student_teaching_context(user)
    result = generate_answer(**inputs)
    serializer = AskResponseSerializer(data=result)
    serializer.is_valid(raise_exception=True)
    response = validated_mapping(serializer.validated_data)
    if user.is_authenticated and result.get('topic') != 'unknown':
        note = save_lecture_note(user, request_data['session_id'], result)
        response['model_info']['note_id'] = str(note.pk)
    return response
