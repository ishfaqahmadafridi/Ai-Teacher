FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1
WORKDIR /workspace/backend
COPY django_app/requirements/base.txt /tmp/django-requirements.txt
COPY fastapi_app/requirements.txt /tmp/fastapi-requirements.txt
RUN pip install -r /tmp/django-requirements.txt -r /tmp/fastapi-requirements.txt
RUN useradd --create-home --uid 1000 app
COPY --chown=app:app django_app ./django_app
COPY --chown=app:app fastapi_app ./fastapi_app
COPY --chown=app:app shared ./shared
USER app
WORKDIR /workspace/backend/django_app
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
