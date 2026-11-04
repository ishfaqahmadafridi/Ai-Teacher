"""Generate a question-specific explanation using explicitly separated evidence."""
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.errors import InferenceUnavailable
from app.langchain import get_langchain_llm
from app.langchain.prompts import SYSTEM_PROMPT, RAG_CONTEXT_TEMPLATE
from ..state import ClassroomState


async def tutor_node(state: ClassroomState) -> dict:
    llm = get_langchain_llm()
    if llm is None:
        raise InferenceUnavailable()
    messages = [SystemMessage(content=SYSTEM_PROMPT)]
    passages = '\n'.join(item['passage'] for item in state.get('retrieved_context', []) if item.get('passage'))
    if passages:
        messages.append(HumanMessage(content=RAG_CONTEXT_TEMPLATE.format(rag_context=passages)))
    messages.append(HumanMessage(content=state.get('question', '')))
    response = await llm.ainvoke(messages)
    if not response.text.strip():
        raise InferenceUnavailable()
    return {'answer': response.text}
