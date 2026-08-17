# Development Setup Guide

## Local Run (Without Docker)

### 1. Django REST Backend
```bash
cd backend/django_app
python -m venv .venv
source .venv/bin/activate
pip install -r requirements/local.txt
python manage.py migrate --settings=config.settings.local
python manage.py runserver --settings=config.settings.local 8000
```

### 2. FastAPI Inference Service
```bash
cd backend/fastapi_app
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8001 --reload
```

## Local Run (With Docker)
```bash
cd infra
docker compose up --build
```
Access via `http://localhost:8080` (Nginx gateway).
