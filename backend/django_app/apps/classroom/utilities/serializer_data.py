"""Narrow DRF validated object data without unchecked casts."""
from collections.abc import Mapping
from typing import Any


def validated_mapping(value: object) -> dict[str, Any]:
    if not isinstance(value, Mapping):
        raise TypeError('Expected a validated serializer mapping')
    return dict(value)
