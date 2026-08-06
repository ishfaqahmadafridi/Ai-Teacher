# API Contracts

## Service Ownership

- `/api/v1/auth/*` → Owned by Django REST (`backend/apps/users/`)
- `/api/teacher/*` → Owned by Django REST (`backend/teacher/`)
- `/api/physics-teacher/*` → Owned by Django REST (`backend/physics_teacher/`)
- `/ai/v1/inference/*` → Owned by FastAPI (`fastapi_app/app/api/v1/endpoints/inference.py`)
