"""Simple provider-facing schemas; REST serializers enforce business bounds."""
from pydantic import BaseModel


class OutlineTopicDetail(BaseModel):
    title: str
    subtopics: list[str]
    exercises: list[str]


class OutlineDraft(BaseModel):
    details: list[OutlineTopicDetail]
    topics: list[str]


