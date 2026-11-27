"""Match reviewer quotes to narration despite cosmetic differences, never paraphrase."""
import re
import unicodedata

QUOTE_TRANSLATION = str.maketrans({'‘': "'", '’': "'", '“': '"', '”': '"', '–': '-', '—': '-'})
TRAILING_ELLIPSIS = re.compile(r'(\.\.\.|…)+\s*$')
LEADING_ELLIPSIS = re.compile(r'^\s*(\.\.\.|…)+')
MIN_EVIDENCE_CHARACTERS = 12


def normalize_evidence_text(text):
    text = unicodedata.normalize('NFKC', text or '').translate(QUOTE_TRANSLATION)
    text = TRAILING_ELLIPSIS.sub('', LEADING_ELLIPSIS.sub('', text))
    return ' '.join(text.split()).casefold().strip(' "\'')


def locate_evidence(chunks, quote, hint=None):
    """Return the chunk index whose narration contains the quote, preferring the hint."""
    needle = normalize_evidence_text(quote)
    if len(needle) < MIN_EVIDENCE_CHARACTERS:
        return None
    order = ([hint] if isinstance(hint, int) and 0 <= hint < len(chunks) else []) + list(range(len(chunks)))
    return next((index for index in order if needle in normalize_evidence_text(chunks[index]['speak'])), None)
