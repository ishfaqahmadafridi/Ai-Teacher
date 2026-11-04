"""Bound teaching requests without cutting current tasks or saved curriculum."""
from copy import deepcopy
from langchain_core.messages.utils import count_tokens_approximately
from apps.classroom.constants.prompt_budget import (
    CONTEXT_TOKENS, OUTPUT_TOKENS, HISTORY_TOKENS, REFERENCE_TOKENS,
    TOKEN_MARGIN, TOKEN_CHARS, MESSAGE_OVERHEAD,
)


class PromptBudgetExceeded(ValueError):
    """Required policy and learning task cannot fit the configured context cap."""


def estimate_tokens(messages):
    # Conservative local estimate: one UTF-8 byte per token plus message framing.
    # This is deliberately not labelled a provider tokenizer measurement.
    return count_tokens_approximately(messages, chars_per_token=TOKEN_CHARS,
                                      extra_tokens_per_message=MESSAGE_OVERHEAD) + sum(
        len(message.content.encode('utf-8')) - len(message.content) for message in messages)


def _remove_oldest(history):
    history.pop(0)
    while history and history[0]['role'] != 'user':
        history.pop(0)


def _reduce_references(context):
    if context.get('image_catalog'):
        context.pop('image_catalog')
        return True
    if context.get('textbook'):
        text = context['textbook']
        if len(text) > MESSAGE_OVERHEAD:
            context['textbook'] = text[:len(text) // 2]
        else:
            context.pop('textbook')
        return True
    sources = context.get('research', {}).get('sources', [])
    if sources:
        sources.pop()
        return True
    return False


def budget_teaching_messages(question, history, context, *, context_limit=CONTEXT_TOKENS,
                             output_tokens=OUTPUT_TOKENS):
    from .teaching_messages import teaching_messages
    available = context_limit - output_tokens - TOKEN_MARGIN
    retained = deepcopy(history)
    references = deepcopy(context)
    history_dropped = 0
    references_trimmed = False
    # History is optional evidence; never retain an orphan assistant response.
    while retained and (retained[0]['role'] != 'user' or estimate_tokens(
            teaching_messages('', retained, {})[1:-1]) > HISTORY_TOKENS):
        before = len(retained)
        _remove_oldest(retained)
        history_dropped += before - len(retained)
    required = {key: value for key, value in context.items() if key not in ('textbook', 'research', 'image_catalog')}
    if estimate_tokens(teaching_messages(question, [], required)) > available:
        raise PromptBudgetExceeded('Required lesson context exceeds the configured input budget.')
    while True:
        if references_trimmed:
            references['reference_context_truncated'] = True
        messages = teaching_messages(question, retained, references)
        reference_only = {key: value for key, value in references.items() if key not in required}
        reference_cost = estimate_tokens(teaching_messages('', [], reference_only)) - estimate_tokens(teaching_messages('', [], {}))
        if reference_cost > REFERENCE_TOKENS and _reduce_references(references):
            references_trimmed = True
            continue
        if estimate_tokens(messages) <= available:
            break
        if retained:
            before = len(retained)
            _remove_oldest(retained)
            history_dropped += before - len(retained)
        elif _reduce_references(references):
            references_trimmed = True
        else:
            raise PromptBudgetExceeded('Required lesson context exceeds the configured input budget.')
    return messages, {
        'estimated_input_tokens': estimate_tokens(messages), 'context_limit': context_limit,
        'reserved_output_tokens': output_tokens, 'safety_margin_tokens': TOKEN_MARGIN,
        'history_messages_dropped': history_dropped, 'references_trimmed': references_trimmed,
        'count_method': 'conservative_utf8_estimate',
    }


def model_prompt_limits(llm):
    """Apply SDK model profiles when available; cap the optional fallback too."""
    import os
    from apps.classroom.constants.prompt_budget import GROQ_CONTEXT_TOKENS
    primary = getattr(llm, 'primary', llm)
    profile = getattr(primary, 'profile', None)
    context_limit, output_tokens = CONTEXT_TOKENS, OUTPUT_TOKENS
    if isinstance(profile, dict):
        maximum = profile.get('max_input_tokens')
        if isinstance(maximum, int) and not isinstance(maximum, bool) and maximum > 0:
            context_limit = min(context_limit, maximum)
        maximum = profile.get('max_output_tokens')
        if isinstance(maximum, int) and not isinstance(maximum, bool) and maximum > 0:
            output_tokens = min(output_tokens, maximum)
    if os.getenv('GROQ_API_KEY'):
        context_limit = min(context_limit, GROQ_CONTEXT_TOKENS)
    if output_tokens + TOKEN_MARGIN >= context_limit:
        raise PromptBudgetExceeded('Context cap must leave room for input, output and safety margin.')
    return context_limit, output_tokens


def validate_model_context(llm, messages, *, requested_output_tokens=None):
    """Reject oversized secondary review requests without cutting their evidence."""
    from langchain_core.messages import convert_to_messages
    context_limit, output_tokens = model_prompt_limits(llm)
    if requested_output_tokens is not None:
        output_tokens = min(output_tokens, requested_output_tokens)
    converted = convert_to_messages(messages)
    if estimate_tokens(converted) + output_tokens + TOKEN_MARGIN > context_limit:
        raise PromptBudgetExceeded('Review input exceeds the configured model context budget.')
    return converted, output_tokens
