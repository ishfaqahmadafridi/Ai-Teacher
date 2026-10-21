"""Authenticated notes retrieval, explicit translation and zero-inference exports."""
from django.http import HttpResponse
from django.utils.http import content_disposition_header
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from drf_spectacular.utils import extend_schema
from apps.classroom.services.note_figures import save_note_figure, note_figures, read_note_figure
from apps.classroom.serializers.note_serializers import NoteFigureSerializer, NoteFigureQuerySerializer, NoteDocumentQuerySerializer
from apps.classroom.constants.notes import DOCX_CONTENT_TYPE, TRANSLATION_REQUEST_RATE
from apps.classroom.serializers.note_serializers import NotesQuerySerializer, NoteLanguageSerializer, NoteResponseSerializer
from apps.classroom.services.lecture_notes import list_lecture_notes, get_lecture_note, note_response
from apps.classroom.services.note_translation import translate_note, saved_note_content
from apps.classroom.services.note_document import create_note_document
from apps.classroom.utilities.note_export import note_document_filename


class PrivateNotesView(APIView):
    permission_classes = [IsAuthenticated]

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        response['Cache-Control'] = 'private, no-store'
        return response


class NotesView(PrivateNotesView):

    @extend_schema(tags=['classroom'], parameters=[NotesQuerySerializer], responses=NoteResponseSerializer(many=True))
    def get(self, request):
        query = NotesQuerySerializer(data=request.query_params)
        query.is_valid(raise_exception=True)
        result = list_lecture_notes(request.user, **query.validated_data)
        return Response(NoteResponseSerializer(result, many=True).data)


class NoteTranslationThrottle(UserRateThrottle):
    rate = TRANSLATION_REQUEST_RATE


class NoteTranslationView(PrivateNotesView):
    throttle_classes = [NoteTranslationThrottle]

    @extend_schema(tags=['classroom'], request=NoteLanguageSerializer, responses=NoteResponseSerializer)
    def post(self, request, note_id):
        data = NoteLanguageSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        note = get_lecture_note(request.user, note_id)
        content, tokens = translate_note(note, data.validated_data['language'])
        return Response(NoteResponseSerializer(note_response(note, content, tokens)).data)


class NoteDocumentView(PrivateNotesView):

    @extend_schema(tags=['classroom'], parameters=[NoteDocumentQuerySerializer], responses={(200, DOCX_CONTENT_TYPE): bytes})
    def get(self, request, note_id):
        query = NoteDocumentQuerySerializer(data=request.query_params)
        query.is_valid(raise_exception=True)
        note = get_lecture_note(request.user, note_id)
        content = saved_note_content(note, query.validated_data['language'])
        response = HttpResponse(create_note_document(note_response(note, content), note_figures(note)), content_type=DOCX_CONTENT_TYPE)
        response['Content-Disposition'] = content_disposition_header(True, note_document_filename(content['title']))
        return response


class NoteFigureView(PrivateNotesView):

    @extend_schema(tags=['classroom'], request=NoteFigureSerializer, responses={204: None})
    def post(self, request, note_id):
        data = NoteFigureSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        note = get_lecture_note(request.user, note_id)
        save_note_figure(note, **data.validated_data)
        return Response(status=204)

    @extend_schema(tags=['classroom'], parameters=[NoteFigureQuerySerializer], responses={(200, 'image/png'): bytes})
    def get(self, request, note_id):
        query = NoteFigureQuerySerializer(data=request.query_params)
        query.is_valid(raise_exception=True)
        note = get_lecture_note(request.user, note_id)
        return HttpResponse(read_note_figure(note, **query.validated_data), content_type='image/png')
