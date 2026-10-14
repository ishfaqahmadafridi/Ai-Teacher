"""Queue a bounded, explicitly selected saved-lesson visual repair."""
from django.core.management.base import BaseCommand
from apps.classroom.models.lecture_notes import LectureNote
from config.celery import app


class Command(BaseCommand):
    help = 'Repair one saved note into a new version using the lesson worker.'

    def add_arguments(self, parser):
        parser.add_argument('--note-id', required=True)

    def handle(self, *args, **options):
        note = LectureNote.objects.get(pk=options['note_id'])
        task = app.send_task('apps.classroom.tasks.repair_saved_visuals', args=[str(note.id)], queue='lessons')
        self.stdout.write(f'Repair queued: {task.id}')
