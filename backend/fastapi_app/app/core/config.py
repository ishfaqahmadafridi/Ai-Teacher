"""Environment-backed inference configuration; credentials have no built-in defaults."""
from pydantic_settings import BaseSettings
from typing import List
from urllib.parse import quote
from pydantic import Field, AliasChoices

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Teacher Inference Engine"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = Field(default="", validation_alias=AliasChoices("DJANGO_SECRET_KEY", "SECRET_KEY"))
    ALGORITHM: str = "HS256"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3001", "http://127.0.0.1:3001"]
    WEBSOCKET_AUTH_TIMEOUT_SECONDS: int = Field(default=10, ge=1, le=30)

    # Database & Redis Settings
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "ai_teacher_db"
    DB_USER: str = "ai_teacher_user"
    DB_PASSWORD: str = ""
    REDIS_URL: str = "redis://localhost:6379/0"

    @property
    def ASYNC_DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{quote(self.DB_USER, safe='')}:{quote(self.DB_PASSWORD, safe='')}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    class Config:
        case_sensitive = True

settings = Settings()
