# API Contracts

## Service Ownership

- `/api/v1/auth/*` → Owned by Django REST (`backend/django_app/apps/users/`)
- `/api/teacher/*` → Owned by Django REST (`backend/django_app/teacher/`)
- `/api/physics-teacher/*` → Owned by Django REST (`backend/django_app/physics_teacher/`)
- `/ai/v1/inference/*` → Owned by FastAPI (`backend/fastapi_app/app/api/v1/endpoints/inference.py`)
