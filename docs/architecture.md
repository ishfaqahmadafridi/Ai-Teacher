# System Architecture

## Services Overview

1. **Django REST Service (`backend/`)**
   - Source of truth for database, user authentication, CRUD operations, and admin panel.
2. **FastAPI Inference Service (`fastapi_app/`)**
   - High-throughput async service for ML/AI model inference (YOLO detection, Voice Agent streaming).
3. **Nginx Reverse Proxy (`infra/nginx/`)**
   - Routes `/api/*` requests to Django REST.
   - Routes `/ai/*` requests to FastAPI.
