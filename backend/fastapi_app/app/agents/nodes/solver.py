"""Solve the submitted problem without substituting a canned physics example."""
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.errors import InferenceUnavailable
from app.langchain import get_langchain_llm
from app.langchain.prompts import SYSTEM_PROMPT, SOLVER_PROMPT
from ..state import ClassroomState


async def solver_node(state: ClassroomState) -> dict:
    llm = get_langchain_llm(temperature=0.1)
    if llm is None:
        raise InferenceUnavailable()
    response = await llm.ainvoke([
        SystemMessage(content=SYSTEM_PROMPT + '\n' + SOLVER_PROMPT),
        HumanMessage(content=state.get('question', '')),
    ])
    if not response.text.strip():
        raise InferenceUnavailable()
    return {'answer': response.text}
