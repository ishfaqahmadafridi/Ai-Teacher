"""Validated evidence and graph state contracts."""
from typing import TypedDict
from pydantic import BaseModel, Field, HttpUrl


class Evidence(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    url: HttpUrl
    excerpt: str = Field(default='', max_length=2000)
    provider: str


class ResearchState(TypedDict):
    question: str
    evidence: list[dict]
    errors: list[str]
