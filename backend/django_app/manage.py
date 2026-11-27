#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    # `manage.py test` uses the isolated test settings, as CI does (.github/workflows/ci.yml):
    # an in-memory database and no shared Redis cache, so rate limits and cached state from
    # development or earlier runs cannot leak into tests. An explicit setting still wins.
    is_test_run = len(sys.argv) > 1 and sys.argv[1] == 'test'
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.test' if is_test_run else 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
