from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Teacher Inference Engine"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "django-insecure-local-dev-only-replace-in-production"
    ALGORITHM: str = "HS256"
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    # Database & Redis Settings
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "ai_teacher_db"
    DB_USER: str = "ai_teacher_user"
    DB_PASSWORD: str = "ai_teacher_secret_pass"
    REDIS_URL: str = "redis://localhost:6379/0"

    @property
    def ASYNC_DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    class Config:
        case_sensitive = True

settings = Settings()
