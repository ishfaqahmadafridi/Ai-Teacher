FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1
RUN apt-get update && apt-get install -y --no-install-recommends espeak-ng && rm -rf /var/lib/apt/lists/*
WORKDIR /workspace/backend
COPY django_app/requirements/base.txt /tmp/django-requirements.txt
COPY django_app/requirements/production.txt /tmp/production-requirements.txt
COPY django_app/requirements/base.txt /tmp/base.txt
COPY fastapi_app/requirements.txt /tmp/fastapi-requirements.txt
ARG BACKEND_REQUIREMENTS=/tmp/django-requirements.txt
RUN pip install -r ${BACKEND_REQUIREMENTS} -r /tmp/fastapi-requirements.txt
RUN useradd --create-home --uid 1000 app
RUN mkdir -p /home/app/private-media && chown app:app /home/app/private-media
COPY --chown=app:app django_app ./django_app
COPY --chown=app:app fastapi_app ./fastapi_app
COPY --chown=app:app shared ./shared
USER app
WORKDIR /workspace/backend/django_app
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
