"""
apps/classroom/utilities/answer_leak.py

Deterministic check that a student-facing reply does not give away a pending answer key.

WHY A SEPARATE UTILITY:
    The doubt teacher never receives the answer key (least privilege), but a model can still
    answer the pending check from its own knowledge. This pure function is the code-level guard
    that runs after generation, outside any model, so the key is used for checking only.

DESIGN DECISIONS:
    - Concepts already written in the check question are ignored: repeating the question is not
      a leak.
    - One concept is a leak if mentioned; with several, half or more is a leak, so explaining one
      related idea is still allowed.
    - Matching is on whole normalized words, ignoring case, punctuation and spacing.
"""
import math
import re

NON_WORD = re.compile(r'[\W_]+', re.UNICODE)
LEAK_FRACTION = 0.5


def normalize_for_match(text):
    """Lower-case words separated by single spaces, padded so substring tests match whole words."""
    return f" {' '.join(NON_WORD.sub(' ', text.casefold()).split())} "


def reveals_expected_answer(reply, expected_concepts, pending_question):
    """Return True when the reply states enough of the expected answer to give the check away."""
    question = normalize_for_match(pending_question)
    hidden = [normalize_for_match(concept) for concept in expected_concepts]
    hidden = [concept for concept in hidden if concept.strip() and concept not in question]
    if not hidden:
        return False
    text = normalize_for_match(reply)
    mentioned = sum(1 for concept in hidden if concept in text)
    return mentioned >= max(1, math.ceil(len(hidden) * LEAK_FRACTION))
