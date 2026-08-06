from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Teacher Inference Engine"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "django-insecure-local-dev-only-replace-in-production"
    ALGORITHM: str = "HS256"
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    class Config:
        case_sensitive = True

settings = Settings()
