"""Controlled inference failures that must never be replaced with invented results."""


class InferenceUnavailable(RuntimeError):
    """The requested inference could not be completed reliably."""
