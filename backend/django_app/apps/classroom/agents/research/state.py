"""Validated evidence and graph state contracts."""
from typing import TypedDict
from pydantic import BaseModel, Field, HttpUrl
from apps.classroom.constants.research import EVIDENCE_TITLE_LIMIT, EVIDENCE_EXCERPT_LIMIT


class Evidence(BaseModel):
    title: str = Field(min_length=1, max_length=EVIDENCE_TITLE_LIMIT)
    url: HttpUrl
    excerpt: str = Field(default='', max_length=EVIDENCE_EXCERPT_LIMIT)
    provider: str


class ResearchState(TypedDict):
    question: str
    evidence: list[dict]
    errors: list[str]
