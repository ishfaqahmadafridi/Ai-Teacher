"""
apps/classroom/management/commands/evaluate_teaching.py

`python manage.py evaluate_teaching [--limit N]`: run the fixed evaluation set through the real
lesson pipeline (calls the configured model provider) and print one row per topic plus a summary.
"""
import json
from django.core.management.base import BaseCommand
from apps.classroom.inference.pipeline import generate_answer
from apps.classroom.services.teaching_evaluation import run_teaching_evaluation

COLUMNS = ('topic', 'subjects', 'subject_correct', 'quality_passed', 'quality_attempts', 'sections', 'words',
           'minutes', 'tokens_total', 'elapsed_seconds', 'provider')


class Command(BaseCommand):
    help = 'Measure lesson quality, size, cost and speed on the fixed evaluation topics (uses the live model).'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=None, help='Evaluate only the first N topics.')

    def handle(self, *args, **options):
        rows, summary = run_teaching_evaluation(generate_answer, options['limit'])
        for row in rows:
            self.stdout.write(json.dumps({column: row[column] for column in COLUMNS}))
        self.stdout.write(self.style.SUCCESS('SUMMARY ' + json.dumps(summary)))
