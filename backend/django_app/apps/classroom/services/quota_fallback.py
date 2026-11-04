"""Use Groq only after an explicit Gemini rate/quota error; never execute model code."""
import httpx
from langchain_core.messages import AIMessage, convert_to_messages
from apps.classroom.constants.providers import GROQ_CHAT_URL, GROQ_MODEL, GROQ_TIMEOUT, GROQ_MAX_TOKENS


def is_quota_error(error):
    seen = set()
    while error is not None and id(error) not in seen:
        seen.add(id(error))
        status = getattr(error, 'status_code', None) or getattr(error, 'code', None)
        if callable(status):
            status = status()
        if status == 429 or getattr(getattr(error, 'response', None), 'status_code', None) == 429:
            return True
        # LangChain wraps Gemini's typed HTTP error, preserving it as the cause.
        error = error.__cause__
    return False


class QuotaFallbackLLM:
    def __init__(self, primary, api_key, temperature, options=None):
        self.primary = primary
        self.api_key = api_key
        self.temperature = temperature
        self.options = options or {}

    def bind(self, **kwargs):
        return QuotaFallbackLLM(self.primary.bind(**kwargs), self.api_key, self.temperature, {**self.options, **kwargs})

    def invoke(self, messages):
        try:
            return self.primary.invoke(messages)
        except Exception as error:
            if not is_quota_error(error):
                raise
        return self.invoke_groq(messages)

    def invoke_groq(self, messages):
        converted = convert_to_messages([('human', messages)] if isinstance(messages, str) else messages)
        roles = {'human': 'user', 'ai': 'assistant', 'system': 'system'}
        if any(message.type not in roles or not isinstance(message.content, str) for message in converted):
            raise ValueError('Groq classroom fallback accepts text messages only.')
        payload = {
            'model': GROQ_MODEL, 'temperature': self.temperature,
            'max_completion_tokens': min(self.options.get('max_output_tokens', GROQ_MAX_TOKENS), GROQ_MAX_TOKENS),
            'response_format': {'type': 'json_object'},
            'messages': [{'role': roles[message.type], 'content': message.content} for message in converted],
        }
        with httpx.Client(timeout=GROQ_TIMEOUT) as client:
            response = client.post(GROQ_CHAT_URL, headers={'Authorization': f'Bearer {self.api_key}'}, json=payload)
            response.raise_for_status()
            data = response.json()
        content = data['choices'][0]['message']['content']
        if not isinstance(content, str) or not content.strip():
            raise ValueError('Groq returned no classroom content.')
        usage = data.get('usage') or {}
        input_tokens, output_tokens = usage.get('prompt_tokens', 0), usage.get('completion_tokens', 0)
        return AIMessage(content=content,
                         usage_metadata={'input_tokens': input_tokens, 'output_tokens': output_tokens,
                                         'total_tokens': input_tokens + output_tokens},
                         response_metadata={'classroom_provider': 'groq', 'model_name': GROQ_MODEL})
